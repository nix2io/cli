const { version } = require('../package.json');
const path = require('path')
const colors = require('colors');
let emoji = require('node-emoji');
// package version
export const VERSION = version;

// file name for the service structure
export const SERVICE_FILE_NAME = "service.yaml";

// config schema
export const CONFIG_PATH = path.join(require('os').homedir(), ".nix-cli/");
export const CONFIG_FILE_PATH = path.join(CONFIG_PATH, 'config.json');
export const CACHE_PATH = path.join(CONFIG_PATH, "cache/");

// template 
export const SERVICE_DISPLAY_TEMPLATE =`Local data ${colors.grey(`from ${SERVICE_FILE_NAME}`)}
    - ${colors.bold('{label}')} ${colors.grey.italic('({identifier})')}
    - {description}
    - v${colors.cyan('{version}')}  -  {authorText}
`

// error messages
export const ERRORS = {
    NO_CHECK_FOR_FILE: "Could not check if file exists",
    NO_OPEN_FILE: "Could not read service.yaml",
    INVALID_YAML: "Could not parse yaml",
    NO_FILE_ACCESS: "Could access the file system",
    SERVICE_EXISTS: colors.red(`${SERVICE_FILE_NAME} already exists in this directory`),
    ABORT: colors.red("\nAborted")
}