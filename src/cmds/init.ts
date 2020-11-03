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

const inquireServiceData = async (
    data: Record<
        string,
        {
            value: string | boolean;
            prompt: inquirer.Question;
        }
    >,
): Promise<any> => {
    return inquirer
        .prompt(Object.values(data).map((question) => question.prompt))
        .then((response) => {
            return response;
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
        .action(async (serviceType: string, options) => {
            // check if a service context exists
            if (getServiceContext(options) != null)
                return console.error(ERRORS.SERVICE_EXISTS);
            const skipConfirm = options.yes;
            // error if the --yes flag is true and there is no type
            if (skipConfirm && !serviceType)
                return console.error(colors.red('No service type provided'));
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
            // get the initial data from the selected class
            const initialData = serviceClass.getInitializeData(options, user);
            const data = skipConfirm
                ? Object.assign(
                      {},
                      ...Object.keys(initialData).map((k: string) => ({
                          [k]: initialData[k].value,
                      })),
                  )
                : await inquireServiceData(initialData);
            const serviceObject = serviceClass.createObject(data, user);
            // define the initialize logic
            const initialize = () => {
                const servicePath = path.join(
                    getServiceContextPath(options),
                    SERVICE_FILE_NAME,
                );
                fs.writeFileSync(servicePath, yaml.safeDump(serviceObject));
                console.log(
                    colors.green(`${SYMBOLS.CHECK} Service initialized`),
                );
            };
            // initialize without confirmation
            if (skipConfirm) return initialize();
            // confirm user to create
            prettyPrint(serviceObject);
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
};
