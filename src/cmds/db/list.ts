/*
 * File: auth.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as commander from 'commander';
import { getClient } from '../../fauna';
import * as fauna from 'faunadb';
import Table = require('cli-table');
import ora = require('ora');
import * as colors from 'colors';

export default (db: commander.Command): void => {
    db.command('list')
        .description('list all the databases associated with the account')
        .action(async () => {
            const client = await getClient(),
                { Databases, Paginate, Get, Map, Lambda, Var } = fauna.query;
            const spinner = ora('Loading Databases').start();
            const startTime = new Date();
            client
                .query(Map(Paginate(Databases()), Lambda('X', Get(Var('X')))))
                .then((result: unknown) => {
                    spinner.stop();
                    const databases = (<
                        {
                            data: {
                                ref: object;
                                ts: number;
                                name: string;
                                global_id: string;
                            }[];
                        }
                    >result).data;
                    const table = new Table({
                        head: ['Name', 'Created At'],
                        style: { head: ['cyan', 'bold'] },
                    });
                    for (const database of databases) {
                        table.push([
                            database.name,
                            new Date(database.ts / 1000).toISOString(),
                        ]);
                    }
                    console.log(table.toString());
                    console.log(
                        colors.grey(
                            `Loaded ${databases.length} databases in ${
                                new Date().getTime() - startTime.getTime()
                            } ms`,
                        ),
                    );
                })
                .catch((err) => {
                    console.log('failed getting the databases');
                    console.error(err);
                });
        });
};
