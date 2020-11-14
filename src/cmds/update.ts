/*
 * File: version.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as ora from 'ora';

import { CommanderStatic } from 'commander';
import { PACKAGE_NAME } from '../constants';
import { asyncExec } from '../util';

export default (program: CommanderStatic): void => {
    program
        .command('update')
        .description('update the cli')
        .action(async () => {
            const spinner = ora('Updating CLI').start();
            await asyncExec(`yarn add global ${PACKAGE_NAME}`).catch((err) => {
                spinner.fail(err.message);
            });
            spinner.succeed('Updated the CLI');
        });
};
