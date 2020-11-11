/*
 * File: constants.ts
 * Created: 10/08/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');
import * as path from 'path';
import * as colors from 'colors';
// package version
export const VERSION = version;

// file name for the service structure
export const SERVICE_FILE_NAME = 'service.yaml';

// config schema
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const CLI_PATH = path.join(require('os').homedir(), '.nix-cli/');
export const CONFIG_FILE_PATH = path.join(CLI_PATH, 'config.json');
export const CACHE_PATH = path.join(CLI_PATH, 'cache/');
export const PLUGIN_PATH = path.join(CLI_PATH, 'plugins/');

export const IS_WINDOWS = process.platform == 'win32';
// make a better options for this
export const SUPPORT_SYMBOLS =
    !IS_WINDOWS ||
    Object.keys(process.env).indexOf('VSCODE_GIT_IPC_HANDLE') != -1;
export const SUPPORT_EMOJI = SUPPORT_SYMBOLS && !IS_WINDOWS;

// environments
export const ENVIRONMENTS = {
    PROD: 'prod',
    DEV: 'dev',
};
export const DEFAULT_ENVIRONMENT = ENVIRONMENTS.DEV;

export const SYMBOLS = {
    // emojis
    ROBOT: SUPPORT_EMOJI ? '🤖' : ' ',
    PAPER: SUPPORT_EMOJI ? '📄' : ' ',
    // symbols
    INFO: SUPPORT_SYMBOLS ? 'ℹ' : ' ',
    WARNING: SUPPORT_SYMBOLS ? '⚠' : ' ',
    CHECK: SUPPORT_SYMBOLS ? '✔' : ' ',
    FAIL: SUPPORT_SYMBOLS ? '' : ' ',
};

export const NONE = colors.grey('none');

// info template
export const SERVICE_DISPLAY_TEMPLATE = `
${SYMBOLS.PAPER} Local data ${colors.grey(`from ${SERVICE_FILE_NAME}`)}
 - ${colors.bold('{label}')} ${colors.grey.italic('({identifier})')}
 - {description}
 - v${colors.cyan('{version}')}  -  {authorText}
 - modified {modified}
 - created {created}
`;

// error messages
export const ERRORS = {
    NO_CHECK_FOR_FILE: 'Could not check if file exists',
    NO_OPEN_FILE: 'Could not read service.yaml',
    INVALID_YAML: 'Could not parse yaml',
    NO_FILE_ACCESS: 'Could access the file system',
    SERVICE_EXISTS: colors.red(
        `${SERVICE_FILE_NAME} already exists in this directory`,
    ),
    NO_SERVICE_EXISTS: `${SERVICE_FILE_NAME} does not exist in this directory`,
    SERVICE_NOT_OF_TYPESCRIPT: `The service is not a Typescript service`,
    PACKAGE_EXISTS: 'package.json already exists in this directory',
    ENV_VAL_NOT_STRING: 'the selected environment in config is not a string',
    INVALID_SEMVER: 'Invalid version, please follow semantic versioning',
    ABORT: colors.red('\nAborted'),
};
