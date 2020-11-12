/*
 * File: cache.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as colors from 'colors';
import * as ora from 'ora';

import { NPR_URL, PLUGIN_PATH, SYMBOLS } from '../constants';

import Axios from 'axios';
import { CommanderStatic } from 'commander';
import { execSync } from 'child_process';
import { join } from 'path';
import { list } from '../util';
import { serviceCore } from '../service';

interface RemotePlugin {
    url: string;
    name: string;
    description: string;
    version: string;
}

const listPlugins = () => {
    if (serviceCore.plugins.length == 0)
        return console.log(colors.grey('No plugins installed'));
    list(serviceCore.plugins.map((plugin) => plugin.NAME));
};

const parseNPRGen1 = (content: string): RemotePlugin[] => {
    const lines = content.split('\n');
    const plugins: RemotePlugin[] = [];
    lines.shift();
    for (const line of lines) {
        if (line == '') continue;
        const pluginParts = line.split('|');
        if (pluginParts.length != 3) throw Error('invalid plugin line');
        const [name, description, version] = pluginParts,
            url = `https://github.com/nix2io/service-plugin-${name}`;
        plugins.push({
            url,
            name,
            description,
            version,
        });
    }
    return plugins;
};

const parseNPRContent = (content: string): RemotePlugin[] => {
    const lines = content.split('\n');
    // First line is the version.
    const nprVersion = parseInt(lines[0]);
    if (isNaN(nprVersion)) throw Error('could not parse npr');
    switch (nprVersion) {
        case 1:
            return parseNPRGen1(content);
        default:
            throw Error('invalid npr version');
    }
};

const listRemotePlugins = async () => {
    const spinner = ora('Loading Plugin Registry').start();
    const response = await Axios.get(NPR_URL)
        .catch((err) => {
            console.error(err);
            throw err;
        })
        .finally(() => {
            spinner.stop();
        });

    const plugins = parseNPRContent(response.data);
    list(
        plugins.map(
            (plugin) =>
                `${plugin.name} - ${plugin.description} - v${plugin.version}`,
        ),
    );
};

const downloadPlugin = async (pluginName: string): Promise<null | string> => {
    const repoName = `service-plugin-${pluginName}`;
    const pluginRepoUrl = `https://github.com/nix2io/${repoName}.git`;
    const pluginPath = join(PLUGIN_PATH, repoName);
    try {
        execSync(`git clone ${pluginRepoUrl} ${pluginPath}`, {
            stdio: 'pipe',
        });
        return null;
    } catch (err) {
        const REPO_NOT_FOUND = err.message.includes('Repository not found');
        const NO_INTERNET = false;
        let errorMsg: string;
        if (REPO_NOT_FOUND) {
            errorMsg = `Plugin: '${pluginName}' was not found`;
        } else if (NO_INTERNET) {
            errorMsg = `No internet connection`;
        } else {
            console.error(err);
            errorMsg = err.message;
        }
        return errorMsg;
    }
};

const addPlugin = async (pluginName: string) => {
    const repoName = `service-plugin-${pluginName}`;
    const pluginPath = join(PLUGIN_PATH, repoName);
    const spinner = ora('Downloading Plugin').start();
    const downloaded = await downloadPlugin(pluginName);
    spinner.stop();
    if (downloaded != null) return console.error(colors.red(downloaded));
    spinner.text = 'Installing Plugin';
    spinner.start();
    execSync(`yarn --cwd ${pluginPath}`, { stdio: 'pipe' });
    spinner.stop();
    console.log(colors.green(`${SYMBOLS.CHECK} Installed '${pluginName}'`));
};

export default (program: CommanderStatic): void => {
    const pluginCommand = program
        .command('plugins')
        .aliases(['plugin', 'plug'])
        .description('manage your cache')
        .action(listPlugins);

    pluginCommand
        .command('list')
        .description('list your installed plugins')
        .action(listPlugins);

    pluginCommand
        .command('remote')
        .description('list all remote plugins')
        .action(listRemotePlugins);

    pluginCommand
        .command('add <pluginName>') // TODO: allow for multiple plugins to be added
        .description('adds a plugin')
        .action((pluginName: string) => {
            addPlugin(pluginName);
        });
};
