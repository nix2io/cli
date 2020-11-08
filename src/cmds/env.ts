/*
 * File: env.ts
 * Created: 11/06/2020 14:43:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import {
    getAvailableEnvironments,
    readCurrentEnvironmentName,
    writeCurrentEnvironmentName,
} from '../environments';
import * as colors from 'colors';
import { SYMBOLS } from '../constants';
import { getServiceContext } from '../service';
import { ServiceContext } from '../classes';

const listAvailableEnvironments = (serviceContext: ServiceContext | null) => {
    const line = colors.grey('------------');
    console.log(line);
    for (const env of getAvailableEnvironments()) {
        const isSelected =
            (serviceContext?.selectedEnvironmentName ||
                readCurrentEnvironmentName()) == env;
        console.log(
            ` - ${env}${isSelected ? colors.green(' (selected)') : ''}`,
        );
    }
    console.log(line);
};

export default (program: CommanderStatic): void => {
    program
        .command('env [envName]')
        .description('manage your working environment')
        .action((envName: string | null, options) => {
            const serviceContext = getServiceContext(options);
            if (envName == null || envName == 'list')
                return listAvailableEnvironments(serviceContext);
            try {
                writeCurrentEnvironmentName(envName);
                if (serviceContext != null) {
                    serviceContext.environment.makeDotEnv();
                }
                console.log(
                    colors.green(
                        `${SYMBOLS.CHECK} switched to env: '${envName}'`,
                    ),
                );
            } catch (err) {
                if (err.message == 'INVALID_ENV') {
                    return console.error(
                        colors.red(`'${envName}' is not a valid environment`),
                    );
                }
                console.error(err);
            }
        });
};
