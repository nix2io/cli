/*
 * File: initalize.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as colors from 'colors';
// const path = require('path');
import * as fs from 'fs';

import {
    CACHE_PATH,
    CLI_PATH,
    CONFIG_FILE_PATH,
    ERRORS,
    PLUGIN_PATH,
} from './constants';

import { checkForUpdates } from './updateChecker';

const createDir = () => {
    try {
        fs.mkdirSync(CLI_PATH);
    } catch (err) {
        throw new Error(ERRORS.NO_FILE_ACCESS);
    }
};

const createCacheDir = () => {
    try {
        fs.mkdirSync(CACHE_PATH);
    } catch (err) {
        throw new Error(ERRORS.NO_FILE_ACCESS);
    }
};

const createConfig = () => {
    try {
        fs.writeFileSync(CONFIG_FILE_PATH, '{}');
    } catch (err) {
        throw new Error(ERRORS.NO_FILE_ACCESS);
    }
};

const createPluginDir = () => {
    try {
        fs.mkdirSync(PLUGIN_PATH);
    } catch (err) {
        throw new Error(ERRORS.NO_FILE_ACCESS);
    }
};

const initalize = () => {
    checkForUpdates();
    // if the main dir does not exist, also create the cache and config
    if (!fs.existsSync(CLI_PATH)) {
        createDir();
        createCacheDir();
        createConfig();
        return;
    }
    // create the cache dir
    if (!fs.existsSync(CACHE_PATH)) createCacheDir();
    // create the config
    if (!fs.existsSync(CONFIG_FILE_PATH)) createConfig();
    // create the plugins
    if (!fs.existsSync(PLUGIN_PATH)) createPluginDir();
};

export default (): void => {
    try {
        initalize();
    } catch (err) {
        console.error(colors.red(`Error initializing: ${err.message}`));
    }
};
