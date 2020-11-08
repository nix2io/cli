/*
 * File: index.ts
 * Created: 11/03/2020 21:43:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import auth from './auth';
import list from './list';
import create from './create';
import link from './link';

export default (program: CommanderStatic): void => {
    const db = program
        .command('db')
        .description("manage your service's database");

    // Apply all the functions to the program
    auth(db);
    list(db);
    create(db);
    link(db);
};
