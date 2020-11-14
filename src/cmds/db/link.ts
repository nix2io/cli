/*
 * File: link.ts
 * Created: 11/04/2020 20:57:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

// import ora = require('ora');
import * as colors from 'colors';
import * as commander from 'commander';

import { createDatabaseKey, getClient } from '../../db';

import { ERRORS } from '../../constants';
import { Service } from '@nix2/service-core';
import { getService } from '../../service';

const linkDatabase = async (serviceContext: Service, dbName: string) => {
    const client = await getClient();
    if (client == null) {
        return console.log(colors.red('Aborted'));
    }
    if (serviceContext.environmentManager.get('DB_KEY') != null) {
        throw Error('ALREADY_LINKED');
    }
    const key = await createDatabaseKey(client, dbName, 'dev');
    console.log(key);
    serviceContext.environmentManager.set('DB_KEY', key.key);
};

export default (db: commander.Command): void => {
    db.command('link')
        .description('link a database to the service')
        .action(async (options) => {
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(ERRORS.NO_SERVICE_EXISTS);
            try {
                await linkDatabase(
                    serviceContext,
                    serviceContext.info.identifier,
                );
            } catch (err) {
                if (err.message == 'ALREADY_LINKED') {
                    console.error(
                        colors.red(
                            'A Database is already linked to this service',
                        ),
                    );
                } else {
                    console.error(err);
                    throw err;
                }
            }
        });
};
