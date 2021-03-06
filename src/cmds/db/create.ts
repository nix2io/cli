import * as colors from 'colors';
/*
 * File: create.ts
 * Created: 10/11/2020 13:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as commander from 'commander';

import { ERRORS, SYMBOLS } from '../../constants';
import { createDatabase, getClient } from '../../db';

import { getService } from '../../service';

import ora = require('ora');

export default (db: commander.Command): void => {
    db.command('create')
        .description('creates a database for the service')
        .action(async (options) => {
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(ERRORS.NO_SERVICE_EXISTS);
            const client = await getClient();
            if (client == null) {
                return console.log(colors.red('Aborted'));
            }
            const spinner = ora('Loading Databases').start();
            const startTime = new Date();
            // set the database name to the service identifier
            const databaseName = serviceContext.info.identifier;

            const database = await createDatabase(client, databaseName).catch(
                (err) => {
                    spinner.stop();
                    if (err.message == 'DATABASE_EXISTS') {
                        console.error(
                            colors.red(
                                `A database with the name '${databaseName}' exists`,
                            ),
                        );
                    } else {
                        console.error(err);
                    }
                    return null;
                },
            );
            spinner.stop();
            if (database == null) return;
            console.log(
                colors.green(
                    `${
                        SYMBOLS.CHECK
                    } Database '${databaseName}' in 'dev' created in ${
                        new Date().getTime() - startTime.getTime()
                    } ms`,
                ),
            );
        });
};
