/*
 * File: auth.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from "commander";
import config from '../config';
import inquirer = require('inquirer');
import { SYMBOLS } from "../constants";
const colors = require('colors');

export default (program: CommanderStatic) => {
    
    program.command('auth')
        .description('authenticate to a user account (WIP)')
        .action(() => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter name'
                    },
                    {
                        type: 'input',
                        name: 'email',
                        message: 'Enter email',
                        validate: inpt => {
                            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inpt)) return "Must be a valid email";
                            return true;
                        }
                    }
                ])
                .then(response => {
                    const name = response.name;
                    const email = response.email;
                    config.set('user', {
                        name,
                        email
                    });
                    console.log(colors.green(`\n${SYMBOLS.CHECK} Authenticated as ${name} <${email}>`));
                })
        })
}