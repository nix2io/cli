/*
 * File: cache.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from "commander";
import cache from '../cache';
import colors = require('colors');
import ora = require('ora');


export default (program: CommanderStatic): void => {

    const cacheCommand = program
        .command('cache')
        .description('manage your cache');

    cacheCommand.command('clearr', 'clear your cache')
        .action(() => {
            const spinner = ora("Clearing cache").start();
            cache.clear();
            spinner.stop();
            console.log(colors.green('Cache cleared'));
        });
}