import * as path from 'path';
import * as fs from 'fs';
import * as colors from 'colors';

import { Obj, Any } from '@nix2/service-core';

import { SERVICE_FILE_NAME } from './constants';
import { promisify } from 'util';
import { exec } from 'child_process';

export const getRootOptions = (options: Obj): Obj => {
    while (
        !!options.name && // name is defined
        typeof options.name == 'function' && // name is a function
        options.name() != 'nix-cli'
    ) {
        options = <Obj>options.parent;
    }
    return options;
};

// get a path to the service directory
export const getServicePath = (
    options: Obj,
    overwriteDir: string | undefined = undefined,
): string => {
    const pathChange =
        overwriteDir || <string>getRootOptions(options).dir || '.';
    return path.join(
        path.isAbsolute(pathChange)
            ? pathChange
            : path.join(process.cwd(), pathChange),
    );
};

export const getServiceFilePath = (
    options: Obj,
    overwriteDir: string | undefined = undefined,
): string => {
    return path.join(getServicePath(options, overwriteDir), SERVICE_FILE_NAME);
};

export const prettyPrint = (v: unknown): void =>
    console.log(prettyFormat(<Any>v));

const prettyFormat = (
    v: Any,
    tabIndex = 0,
    lastElementList = false,
): string => {
    const tab = Array(tabIndex + 1).join('    ');
    // first few are simple
    if (typeof v == 'string') return colors.green(v);
    if (typeof v == 'number') return colors.cyan(v.toString());
    if (typeof v == 'boolean') return colors.blue(v ? 'true' : 'false');
    if (typeof v == 'undefined') return colors.grey('undefined');
    if (v == null) return colors.grey('null');
    if (v instanceof Set) Array.from(v);

    if (Array.isArray(v))
        return v
            .map((i) => `\n${tab}- ${prettyFormat(i, tabIndex + 1, true)}`)
            .join('');

    if (typeof v == 'object') {
        let s = '';
        let i = 0;
        if (v instanceof Set) throw Error('should not be a set');
        for (const key in v) {
            s += `${
                i == 0 && lastElementList ? '' : `\n${tab}`
            }${key}: ${prettyFormat(v[key], tabIndex + 1)}`;
            i++;
        }
        return s;
    }
    throw new Error('unsupported pretty print');
};

export const formatString = (
    string: string,
    obj: Record<string, string | null>,
): string => {
    for (const key in obj) {
        let value = obj[key];
        if (value == null) value = 'null';
        string = string.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return string;
};

export const titleCase = (str: string): string =>
    str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

export const list = (lines: string[]): void => {
    const maxLineLength = Math.max(...lines.map((l) => l.length));
    const border = colors.grey(Array(maxLineLength + 1).join('-'));
    console.log(border);
    lines.forEach((line) => console.log(line));
    console.log(border);
};

export const deleteDirectoryRecursive = (dirPath: string): void => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file: string, _) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteDirectoryRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
};

export const asyncExec = promisify(exec);
