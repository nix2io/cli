/*
 * File: index.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import gitignore from './gitignore';
import readme from './readme';
import type from './type';

export default (program: CommanderStatic): void => {
    const make = program
        .command('make')
        .alias('mk')
        .description('make things related to your service');

    // Apply all the functions to the program
    type(make);
    readme(make);
    gitignore(make);
};
