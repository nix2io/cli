import path = require('path');
import colors = require('colors');
import { SERVICE_FILE_NAME } from './constants';

export const joinPaths = (pathChange: string) => {
    return path.join(
        path.isAbsolute(pathChange)
            ? pathChange
            : path.join(process.cwd(), pathChange),
        SERVICE_FILE_NAME,
    );
};

export const formatString = (
    string: string,
    obj: { [key: string]: any },
): string => {
    for (let key in obj) {
        let value = obj[key];
        string = string.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return string;
};

export const titleCase = (str: string) =>
    str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

export const prettyPrint = (v: any) => console.log(prettyFormat(v));

const prettyFormat = (
    v: any,
    tabIndex = 0,
    lastElementList = false,
): string => {
    // first few are simple
    if (typeof v == 'string') return colors.green(v);
    if (typeof v == 'number') return colors.cyan(v.toString());
    if (typeof v == 'boolean') return colors.blue(v ? 'true' : 'false');
    if (typeof v == 'undefined') return colors.grey('undefined');
    if (v == null) return colors.grey('null');
    if (v instanceof Set) Array.from(v);

    if (Array.isArray(v))
        return v
            .map(
                (i) =>
                    `\n${Array(tabIndex).join('  ')}- ${prettyFormat(
                        i,
                        tabIndex + 1,
                        true,
                    )}`,
            )
            .join('');

    if (typeof v == 'object') {
        let s = '';
        let i = 0;
        for (let key in v) {
            s += `${
                i == 0 && lastElementList
                    ? ''
                    : `\n${Array(tabIndex).join('  ')}`
            }${key}: ${prettyFormat(v[key], tabIndex + 1)}`;
            i++;
        }
        return s;
    }
    throw new Error('unsupported pretty print');
};
