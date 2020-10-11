const { version } = require('../package.json');
const colors = require('colors');
// package version
export const VERSION = version;

// file name for the service structure
export const SERVICE_FILE_NAME = "service.yaml";

// template 
export const SERVICE_DISPLAY_TEMPLATE =`${colors.underline('local data')} ${colors.grey(`from ${SERVICE_FILE_NAME}`)}
|
|  ${colors.bold('{label}')} ${colors.grey.italic('({identifier})')}
|  {description}
|  v${colors.cyan('{version}')}  -  {authorText}
|`

// error messages
export const ERRORS = {
    NO_CHECK_FOR_FILE: "Could not check if file exists",
    NO_OPEN_FILE: "Could not read service.yaml",
    INVALID_YAML: "Could not parse yaml",
    ABORT: colors.red("\nAborted")
}