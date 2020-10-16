/*
 * File: gateway.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as commander from "commander";

export default (make: commander.Command): void => {

    make
        .command('gateway')
        .description('make a gateway')
        .action(() => {
            console.log('creating gateway');
        });
}