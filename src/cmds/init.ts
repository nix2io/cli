/*
 * File: init.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import { titleCase, prettyPrint } from 'koontil';
import inquirer = require('inquirer');
import { ERRORS, SERVICE_FILE_NAME, SYMBOLS } from '../constants';
import { getServiceContext } from '../service';
import { authed, user } from '../user';
import yaml = require('js-yaml');
import fs = require('fs');
import path = require('path');
import colors = require('colors');


export default (program: CommanderStatic): void => {

    program
        .command('init [dirname]')
        .description('initialize a service')
        .option('-y, --yes', 'skip the confirm message')
        .action((dirname: string, commandOptions) => {
            // check if a service context exists
            if (getServiceContext() != null) return console.error(ERRORS.SERVICE_EXISTS);
            const skipConfirm = commandOptions.yes;
            // get the name of the service
            if (dirname == null) dirname = '.';
            const servicePath = path.join(process.cwd(), dirname),
                serviceIdentifier = path.basename(servicePath),
                serviceLabel = titleCase(serviceIdentifier.replace(/-/g, ' '));
            // create the questions
            const defaults = {
                identifier: serviceIdentifier,
                label: serviceLabel,
                description: 'A Nix² Service',
            }
            // let the options be defaults
            let options: { [key: string]: any } = Object.assign({}, defaults);
            options.userLeadDev = authed;

            const createServiceObject = (options: any) => {
                const currentTimestamp = Math.floor(new Date().getTime() / 1000);
                const info: { [key: string]: any } = {
                    identifier: options.identifier,
                    label: options.label,
                    description: options.description,
                    version: '1.0.0',
                    authors: [],
                    created: currentTimestamp,
                    modified: currentTimestamp,
                    license: 'CC',
                    termsOfServiceURL: 'nix2.io/tos'
                }
                // add the authed user as a main dev
                if (options.userLeadDev) info.authors.push({
                    email: user?.email,
                    name: user?.name,
                    publicEmail: null,
                    url: null,
                    flags: ['leadDev']  // using an array bc yaml dump
                });
                const type = 'app',
                    data = {
                        info,
                        type
                    };

                return data;
            }

            // TODO: create better types
            const initialize = () => {
                const newServiceFilePath = path.join(servicePath, SERVICE_FILE_NAME);
                fs.writeFileSync(newServiceFilePath, yaml.safeDump(createServiceObject(options)));
                console.log(colors.green(`${SYMBOLS.CHECK} Service initialized`));
            }

            if (skipConfirm) return initialize();

            // create the questions for inquirer

            const questions: { [key: string]: any }[] = [];

            let k: keyof typeof defaults;
            for (k in defaults) {
                const value = defaults[k];
                questions.push({
                    type: 'input',
                    message: titleCase(k),
                    name: k,
                    default: value
                });
            }
            if (authed) questions.push({
                type: 'confirm',
                message: 'Make you the lead dev?',
                name: 'userLeadDev'
            });

            // console.log(questions);

            inquirer
                .prompt(questions)
                .then((info: any) => {
                    // merge the current options
                    options = { ...options, ...info };

                    const data = createServiceObject(options);


                    prettyPrint(data);

                    // confirm user to create
                    inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                message: 'Proceed to initialize the service?',
                                name: 'confirm'
                            }
                        ])
                        .then((answer: any) => {
                            if (!answer.confirm) return console.log(ERRORS.ABORT);
                            initialize();
                        });


                })



        })
}