/*
 * File: cache.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as colors from 'colors';
import * as ora from 'ora';

import { NPR_URL, PLUGIN_PATH } from '../constants';
import { asyncExec, deleteDirectoryRecursive, list } from '../util';

import Axios from 'axios';
import { CommanderStatic } from 'commander';
import { PluginNotFoundError } from '@nix2/service-core';
import { existsSync } from 'fs';
import { join } from 'path';
import { serviceCore } from '../service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Spinnies = require('spinnies');

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
            spinner.fail(err);
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

const downloadPlugin = async (pluginName: string): Promise<boolean> => {
    const repoName = `service-plugin-${pluginName}`;
    const pluginRepoUrl = `https://github.com/nix2io/${repoName}.git`;
    const pluginPath = join(PLUGIN_PATH, repoName);
    await asyncExec(`git clone ${pluginRepoUrl} ${pluginPath}`).catch((err) => {
        if (err.message.includes('Repository not found')) {
            throw new PluginNotFoundError(pluginName);
        } else {
            throw err;
        }
    });
    return true;
};

const installPlugin = async (pluginPath: string): Promise<boolean> => {
    await asyncExec(`yarn --cwd ${pluginPath}`).catch((err) => {
        throw err;
    });
    return true;
};

const addPlugin = async (pluginName: string) => {
    await downloadPlugin(pluginName);
    await installPlugin(join(PLUGIN_PATH, `service-plugin-${pluginName}`));
};

const removePlugin = async (pluginName: string) => {
    const pluginPath = join(PLUGIN_PATH, `service-plugin-${pluginName}`);
    // Check if the plugin exists
    if (!existsSync(pluginPath)) throw new PluginNotFoundError(pluginName);
    deleteDirectoryRecursive(pluginPath);
};

const pullPlugin = async (pluginPath: string): Promise<boolean> => {
    await asyncExec(`git -C ${pluginPath} pull`).catch((err) => {
        throw err;
    });
    return true;
};

const updatePlugin = async (pluginName: string) => {
    const pluginPath = join(PLUGIN_PATH, `service-plugin-${pluginName}`);
    // Check for the plugins existance.
    if (!existsSync(pluginPath)) throw new PluginNotFoundError(pluginName);
    // Try to do a git pull from the plugin repo
    const ok = await pullPlugin(pluginPath).catch((err) => {
        throw new Error(err.message);
    });
    if (!ok) return;
    // Try to install the plugin with yarn.
    await installPlugin(pluginPath).catch((err) => {
        throw new Error(err.message);
    });
};

const applyToPlugins = (
    plugins: string[],
    method: (_: string) => Promise<void>,
    before: string,
    after: string,
) => {
    const spinnies = new Spinnies();
    for (const pluginName of plugins) {
        const spinnerName = `${pluginName}-spinner`;
        spinnies.add(spinnerName, {
            text: `${before} ${pluginName}`,
            spinnerColor: 'cyan',
        });
        method(pluginName)
            .then(() => {
                spinnies.succeed(spinnerName, {
                    text: `${after} ${pluginName}`,
                });
            })
            .catch((err: Error) => {
                spinnies.fail(spinnerName, { text: err.message });
            });
    }
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
        .command('add <plugins...>')
        .description('adds plugins')
        .action(async (plugins: string[]) => {
            applyToPlugins(plugins, addPlugin, 'Adding', 'Installed');
        });

    pluginCommand
        .command('remove <plugins...>')
        .description('remove a plugin')
        .action(async (plugins: string[]) => {
            applyToPlugins(plugins, removePlugin, 'Removing', 'Removed');
        });

    pluginCommand
        .command('update <plugins...>')
        .description('updates plugins')
        .action(async (plugins: string[]) => {
            applyToPlugins(plugins, updatePlugin, 'Updating', 'Updated');
        });
};
