// This code was taken from https://github.com/stevenvachon/edit-dotenv
// and converted to Typescript by myself

import { auto as normalizeEOL } from 'eol';
import { EOL } from 'os';
import * as escapeStringRegexp from 'escape-string-regexp';

const breakPattern = /\n/g;
const breakReplacement = '\\n';
const flags = 'gm';
const groupPattern = /\$/g;
const groupReplacement = '$$$';
const h = '[^\\S\\r\\n]'; // simulate `\h`
const returnPattern = /\r/g;
const returnReplacement = '\\r';

export default (envString: string, changes: Record<string, string>) => {
    let hasAppended = false;

    return Object.keys(changes).reduce((result, varname) => {
        const value = changes[varname]
            .replace(breakPattern, breakReplacement)
            .replace(returnPattern, returnReplacement)
            .trim();

        const safeName = escapeStringRegexp(varname);

        const varPattern = new RegExp(
            `^(${h}*${safeName}${h}*=${h}*)\\S*(${h}*)$`,
            flags,
        );

        if (varPattern.test(result)) {
            const safeValue = value.replace(groupPattern, groupReplacement);

            return result.replace(varPattern, `$1${safeValue}$2`);
        } else if (result === '') {
            hasAppended = true;

            return `${varname}=${value}${EOL}`;
        } else if (!result.endsWith(EOL) && !hasAppended) {
            hasAppended = true;

            // Add an extra break between previously defined and newly appended variable
            return `${result}${EOL}${EOL}${varname}=${value}`;
        } else if (!result.endsWith(EOL)) {
            // Add break for appended variable
            return `${result}${EOL}${varname}=${value}`;
        } else if (result.endsWith(EOL) && !hasAppended) {
            hasAppended = true;

            // Add an extra break between previously defined and newly appended variable
            return `${result}${EOL}${varname}=${value}${EOL}`;
        } /*if (result.endsWith(EOL))*/ else {
            // Add break for appended variable
            return `${result}${varname}=${value}${EOL}`;
        }
    }, normalizeEOL(envString));
};
