/*
 * File: init.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import { titleCase, prettyPrint, getServiceContextPath } from '../util';
import inquirer = require('inquirer');
import { ERRORS, SERVICE_FILE_NAME, SYMBOLS } from '../constants';
import { getServiceClassFromType, getServiceContext } from '../service';
import { authed, user } from '../user';
import yaml = require('js-yaml');
import fs = require('fs');
import path = require('path');
import colors = require('colors');
import { InfoType, SchemaType, ServiceContextType } from '../types';
import { SERVICE_TYPE_MAP, VALID_SERVICE_TYPES } from '../classes/services';

const inquireServiceType = async (): Promise<string> => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Select service type',
                choices: Object.values(SERVICE_TYPE_MAP).map(
                    (service: unknown) => (<VALID_SERVICE_TYPES>service).NAME,
                ),
            },
        ])
        .then((data) => {
            return data.type;
        })
        .catch((err) => {
            throw Error(err);
        });
};

const getServiceClassFromTypeOrNull = (type: string) => {
    try {
        return getServiceClassFromType(type);
    } catch (err) {
        return null;
    }
};

export default (program: CommanderStatic): void => {
    program
        .command('init [serviceType]')
        .description('initialize a service')
        .option('-y, --yes', 'skip the confirm message')
        .action(async (serviceType: string, commandOptions) => {
            // check if a service context exists
            if (getServiceContext(commandOptions) != null)
                return console.error(ERRORS.SERVICE_EXISTS);
            const skipConfirm = commandOptions.yes;
            // get the name of the service
            const servicePath = getServiceContextPath(commandOptions),
                serviceIdentifier = path.basename(servicePath),
                serviceLabel = titleCase(serviceIdentifier.replace(/-/g, ' '));
            // prompt the user for the type if none given
            const serviceClass = getServiceClassFromTypeOrNull(
                serviceType || (await inquireServiceType()),
            );
            // give an error if the class is not found
            if (serviceClass == null) {
                return console.error(
                    colors.red(`${serviceType} is not a valid service type`),
                );
            }
            return;
            // create the questions
            const defaults = {
                identifier: serviceIdentifier,
                label: serviceLabel,
                description: 'A Nix² Service',
            };
            // let the options be defaults
            let options: Record<string, unknown> = Object.assign({}, defaults);
            options.userLeadDev = authed;

            const createServiceObject = (options: Record<string, any>) => {
                const currentTimestamp = Math.floor(
                    new Date().getTime() / 1000,
                );
                const info: InfoType = {
                    identifier: options.identifier,
                    label: options.label,
                    description: options.description,
                    version: '1.0.0',
                    authors: [],
                    created: currentTimestamp,
                    modified: currentTimestamp,
                    license: 'CC',
                    termsOfServiceURL: 'nix2.io/tos',
                };
                // add the authed user as a main dev
                if (options.userLeadDev && authed && user != null)
                    info.authors.push({
                        email: user.email,
                        name: user.name,
                        publicEmail: null,
                        url: null,
                        alert: '*',
                        flags: ['leadDev'], // using an array bc yaml dump
                    });
                const type = 'app',
                    schemas: SchemaType[] = [],
                    data: ServiceContextType = {
                        info,
                        type,
                        schemas,
                    };

                return data;
            };

            const initialize = () => {
                const newServiceFilePath = path.join(
                    servicePath,
                    SERVICE_FILE_NAME,
                );
                fs.writeFileSync(
                    newServiceFilePath,
                    yaml.safeDump(createServiceObject(options)),
                );
                console.log(
                    colors.green(`${SYMBOLS.CHECK} Service initialized`),
                );
            };

            if (skipConfirm) return initialize();

            // create the questions for inquirer

            const questions: Record<string, unknown>[] = [];

            let k: keyof typeof defaults;
            for (k in defaults) {
                const value = defaults[k];
                questions.push({
                    type: 'input',
                    message: titleCase(k),
                    name: k,
                    default: value,
                });
            }
            if (authed)
                questions.push({
                    type: 'confirm',
                    message: 'Make you the lead dev?',
                    name: 'userLeadDev',
                });

            // console.log(questions);

            inquirer.prompt(questions).then((info) => {
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
                            name: 'confirm',
                        },
                    ])
                    .then((answer) => {
                        if (!answer.confirm) return console.log(ERRORS.ABORT);
                        initialize();
                    });
            });
        });
};
