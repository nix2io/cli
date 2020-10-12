import { CONFIG_PATH, CACHE_PATH, CONFIG_FILE_PATH, ERRORS } from './constants';
const colors = require('colors');
// const path = require('path');
const fs = require('fs');


const createDir = () => {
    try { fs.mkdirSync(CONFIG_PATH); }
    catch (err) { throw new Error(ERRORS.NO_FILE_ACCESS); }
}

const createCacheDir = () => {
    try { fs.mkdirSync(CACHE_PATH); }
    catch (err) { throw new Error(ERRORS.NO_FILE_ACCESS); }
}

const createConfig = () => {
    try { fs.writeFileSync(CONFIG_FILE_PATH, '{}'); }
    catch (err) { throw new Error(ERRORS.NO_FILE_ACCESS); }
}

const initalize = () => {
    // if the main dir does not exist, also create the cache and config
    if (!fs.existsSync(CONFIG_PATH)){
        createDir();
        createCacheDir();
        createConfig();
        return;
    }
    // create the cache dir
    if (!fs.existsSync(CACHE_PATH)) createCacheDir();
    // create the config
    if (!fs.existsSync(CONFIG_FILE_PATH)) createConfig();
}

export default () => {
    try { initalize() } catch(err) { console.error(colors.red(`Error initializing: ${err.message}`)); }
}