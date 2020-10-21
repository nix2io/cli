/*
 * File: info.ts
 * Created: 10/09/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import { formatString } from 'koontil';
import { VERSION, SERVICE_DISPLAY_TEMPLATE, SYMBOLS } from '../constants';
import { getServiceContext } from '../service';
import { authed, user } from '../user';
import colors = require('colors');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friendlyTime = require('friendly-time');
// const ora = require('ora');

export default (program: CommanderStatic): void => {
    program
        .command('info')
        .description('display service context info')
        .action(() => {
            console.log(
                SYMBOLS.ROBOT +
                    ' ' +
                    colors.bold('Nix2 CLI') +
                    colors.grey(` v${VERSION}`),
            );
            if (authed) {
                console.log(
                    colors.cyan(` ${SYMBOLS.INFO} Authed as ${user?.name}`),
                );
            } else {
                console.log(
                    colors.yellow(` ${SYMBOLS.WARNING} No user authed`),
                );
            }
            // get the service
            try {
                const service = getServiceContext();
                if (service == null) {
                    console.log(colors.grey('No service in this directory'));
                    return;
                }
                const info = service.info;
                const devCount = service.info.getDevs().length;

                console.log(
                    formatString(SERVICE_DISPLAY_TEMPLATE, {
                        label: info.label,
                        identifier: info.identifier,
                        description: info.description,
                        version: info.version,
                        authorText: `${devCount} dev${
                            devCount != 1 ? 's' : ''
                        }`,
                        created: friendlyTime(info.created),
                        modified: friendlyTime(info.modified),
                    }),
                );
            } catch (err) {
                console.error(err);
                console.error(colors.red(`ERR: ${err.message}`));
            }
        });
};
