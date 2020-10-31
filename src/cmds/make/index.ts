/*
 * File: index.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import gateway from './gateway';
import api from './api';
import type from './type';
import { pkg } from './package';

export default (program: CommanderStatic): void => {
    const make = program
        .command('make')
        .description('make things related to your service');

    // Apply all the functions to the program
    gateway(make);
    api(make);
    type(make);
    pkg(make);
};
