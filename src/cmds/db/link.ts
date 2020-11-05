/*
 * File: link.ts
 * Created: 11/04/2020 20:57:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as commander from 'commander';
import ora = require('ora');
import * as colors from 'colors';
import { getClient, createDatabaseKey } from '../../db';
import { getServiceContext } from '../../service';
import { ERRORS } from '../../constants';

const linkDatabase = async (dbName: string) => {
    const client = await getClient();
    if (client == null) {
        return console.log(colors.red('Aborted'));
    }
    await createDatabaseKey(client, dbName, 'dev');
};

export default (db: commander.Command): void => {
    db.command('link')
        .description('link a database to the service')
        .action(async (options) => {
            const serviceContext = getServiceContext(options);
            if (serviceContext == null)
                return console.error(ERRORS.NO_SERVICE_EXISTS);

            await linkDatabase(serviceContext.info.identifier);
        });
};
