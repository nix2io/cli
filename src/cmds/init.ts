/*
 * File: init.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
// Node packages
import fs = require('fs');
import path = require('path');
// Service Core
// import { Service } from '@nix2/service-core';
// Other packages
import { CommanderStatic } from 'commander';
import * as inquirer from 'inquirer';
import { safeDump } from 'js-yaml';
import * as colors from 'colors';
// CLI specific
import { getService, services, serviceCore } from '../service';
import { prettyPrint, getServicePath } from '../util';
import { ERRORS, SERVICE_FILE_NAME, SYMBOLS } from '../constants';
import { user } from '../user';

const inquireServiceType = async (): Promise<string> => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Select service type',
                choices: Object.values(services).map((service) => service.NAME),
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
): Promise<Record<string, unknown>> => {
    return inquirer
        .prompt(Object.values(data).map((question) => question.prompt))
        .then((response) => {
            return response;
        })
        .catch((err) => {
            throw Error(err);
        });
};

export default (program: CommanderStatic): void => {
    program
        .command('init [serviceType]')
        .description('initiali ze a service')
        .option('-y, --yes', 'skip the confirm message')
        .action(async (serviceType: string, options) => {
            // check if a service context exists
            if (getService(options) != null)
                return console.error(ERRORS.SERVICE_EXISTS);
            const skipConfirm = options.yes;
            // error if the --yes flag is true and there is no type
            if (skipConfirm && !serviceType)
                return console.error(colors.red('No service type provided'));
            // prompt the user for the type if none given
            const serviceClass = serviceCore.getServiceClassFromType(
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
            const serviceObject = serviceClass.makeObject(data, user);
            // define the initialize logic
            const initialize = () => {
                const servicePath = path.join(
                    getServicePath(options),
                    SERVICE_FILE_NAME,
                );
                fs.writeFileSync(servicePath, safeDump(serviceObject));
                console.log(
                    colors.green(`${SYMBOLS.CHECK} Service initialized`),
                );
                console.log('Running post init logic');
                // create the new instance
                const service = getServiceContext(options);
                service?.postInit();
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
