/*
 * File: auth.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as commander from 'commander';
import ora = require('ora');
import * as colors from 'colors';
import { getClient, getAllDatabases, DatabaseListType } from '../../db';

export default (db: commander.Command): void => {
    db.command('list')
        .description('list all the databases associated with the account')
        .action(async () => {
            const client = await getClient();
            if (client == null) {
                return console.log(colors.red('Aborted'));
            }
            const spinner = ora('Loading All Databases').start();
            const startTime = new Date();
            const databases = await getAllDatabases(client);
            spinner.stop();
            console.log(`-----------------`.grey);
            for (const database of databases) {
                console.log(
                    ` ${
                        database.environments.has('prod')
                            ? colors.green('●')
                            : '●'
                    } ${database.name}`,
                );
            }
            console.log(`-----------------`.grey);
            console.log(
                colors.grey(
                    `Loaded ${databases.length} databases in ${
                        new Date().getTime() - startTime.getTime()
                    } ms`,
                ),
            );
        });
};
