import { CommanderStatic } from "commander";
import config from '../config';
import inquirer = require('inquirer');
const colors = require('colors');

export default (program: CommanderStatic) => {
    
    program.command('auth')
        .description('authenticate to a user account (WIP)')
        .action(() => {
            inquirer
                .prompt([
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
                    const email = response.email;
                    config.set('email', email);
                    console.log(colors.green(`\n✔ Authenticated as ${email}`));
                })
        })
}