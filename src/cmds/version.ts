/*
 * File: version.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as colors from 'colors';

import { CommanderStatic } from 'commander';
import { ERRORS } from '../constants';
import { getService } from '../service';

export default (program: CommanderStatic): void => {
    program
        .command('version [version]')
        .description('version your service')
        .action((version: string | null, options) => {
            const service = getService(options);
            if (service == null)
                return console.error(colors.red(ERRORS.NO_SERVICE_EXISTS));
            // if no version was given, print the current version
            if (version == null)
                return console.log(
                    `The '${
                        service.info.identifier
                    }' is on version ${colors.bold(service.info.version)}`,
                );
            let response;
            if (version == 'patch') {
                response = service.info.versionManager.patch();
            } else if (version == 'minor') {
                response = service.info.versionManager.minor();
            } else if (version == 'major') {
                response = service.info.versionManager.major();
            } else {
                try {
                    response = service.info.versionManager.set(version);
                } catch (err) {
                    if (err.message == ERRORS.INVALID_SEMVER) {
                        return console.error(colors.red(err.message));
                    }
                    throw err;
                }
            }
            service.write();
            console.log(colors.green(`Updated version to ${response}`));
        });
};
