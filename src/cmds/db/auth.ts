/*
 * File: auth.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as commander from 'commander';
import { getFaunaAccessToken, saveFaunaAccessToken } from '../../db';

export default (db: commander.Command): void => {
    db.command('auth [key]')
        .description('authenticate with FaunaDB')
        .action(async (key: string) => {
            key = key || (await getFaunaAccessToken());
            saveFaunaAccessToken(key);
        });
};
