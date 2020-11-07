/*
 * File: version.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { CommanderStatic } from 'commander';
import colors = require('colors');
import { getServiceContext } from '../service';
import { ERRORS } from '../constants';

export default (program: CommanderStatic): void => {
    program
        .command('version [version]')
        .description('version your service')
        .action((version: string | null, options) => {
            const serviceContext = getServiceContext(options);
            if (serviceContext == null)
                return console.error(colors.red(ERRORS.NO_SERVICE_EXISTS));
            // if no version was given, print the current version
            if (version == null)
                return console.log(
                    `The '${
                        serviceContext.info.identifier
                    }' is on version ${colors.bold(
                        serviceContext.info.version,
                    )}`,
                );
            let response;
            if (version == 'patch') {
                response = serviceContext.info.versionBump.patch();
            } else if (version == 'minor') {
                response = serviceContext.info.versionBump.minor();
            } else if (version == 'major') {
                response = serviceContext.info.versionBump.major();
            } else {
                try {
                    response = serviceContext.info.versionBump.set(version);
                } catch (err) {
                    if (err.message == ERRORS.INVALID_SEMVER) {
                        return console.error(colors.red(err.message));
                    }
                    throw err;
                }
            }
            try {
                serviceContext.write();
                console.log(colors.green(`Updated version to ${response}`));
            } catch (err) {
                throw err;
            }
        });
};
