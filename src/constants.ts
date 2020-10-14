const { version } = require('../package.json');
const path = require('path')
const colors = require('colors');
// package version
export const VERSION = version;

// file name for the service structure
export const SERVICE_FILE_NAME = "service.yaml";

// config schema
export const CONFIG_PATH = path.join(require('os').homedir(), ".nix-cli/");
export const CONFIG_FILE_PATH = path.join(CONFIG_PATH, 'config.json');
export const CACHE_PATH = path.join(CONFIG_PATH, "cache/");

export const IS_WINDOWS = process.platform == "win32";
// make a better options for this
export const SUPPORT_SYMBOLS = !IS_WINDOWS || Object.keys(process.env).indexOf('VSCODE_GIT_IPC_HANDLE') != -1;
export const SUPPORT_EMOJI = SUPPORT_SYMBOLS && !IS_WINDOWS;

export const SYMBOLS = {
    // emojis
    ROBOT: SUPPORT_EMOJI ? '🤖' : ' ',
    PAPER: SUPPORT_EMOJI ? '📄' : ' ',
    // symbols
    INFO:    SUPPORT_SYMBOLS ? 'ℹ' : ' ',
    WARNING: SUPPORT_SYMBOLS ? '⚠' : ' ',
    CHECK:   SUPPORT_SYMBOLS ? '✔' : ' ',
    FAIL:    SUPPORT_SYMBOLS ? '' : ' '
}

export const NONE = colors.grey('none');

// template 
export const SERVICE_DISPLAY_TEMPLATE =`
${SYMBOLS.PAPER} Local data ${colors.grey(`from ${SERVICE_FILE_NAME}`)}
 - ${colors.bold('{label}')} ${colors.grey.italic('({identifier})')}
 - {description}
 - v${colors.cyan('{version}')}  -  {authorText}
 - modified {modified}
 - created {created}
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