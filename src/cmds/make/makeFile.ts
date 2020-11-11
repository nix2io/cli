import * as commander from 'commander';
import colors = require('colors');
import { getService } from '../../service';
import { ERRORS, SYMBOLS } from '../../constants';
import { join } from 'path';
import inquirer = require('inquirer');
import { existsSync } from 'fs';
import ora = require('ora');
import { Service } from '@nix2/service-core';

export const makeCommand = (
    make: commander.Command,
    command: string[] | string,
    fileName: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    creationFunction: Function,
    serviceContextType: typeof Service | null = null,
): void => {
    let aliases: string[] = [];
    if (Array.isArray(command)) {
        if (command.length == 0) throw Error('invalid commands');
        aliases = command;
        command = <string>aliases.shift();
    }
    make.command(command)
        .description(`make a ${fileName} file`)
        .aliases(aliases)
        // overwrite option flag
        .option('--overwrite', `overwrite ${fileName}`)
        .action((options) => {
            // Make sure there is a service context.
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(colors.red(ERRORS.NO_SERVICE_EXISTS));
            // If a specific service is defined, check to be sure it is the right service context.
            if (serviceContextType != null) {
                if (!(serviceContext instanceof serviceContextType)) {
                    return console.error(
                        colors.red(
                            `Service is not a '${serviceContextType.NAME}'`,
                        ),
                    );
                }
            }
            const createFile = async (overwrite = false) => {
                const spinner = ora(
                    `${overwrite ? 'Overwritting' : 'Generating'} ${fileName}`,
                ).start();
                try {
                    await creationFunction.call(serviceContext);
                    spinner.stop();
                    console.log(
                        colors.green(`${SYMBOLS.CHECK} Created ${fileName}`),
                    );
                } catch (err) {
                    spinner.stop();
                    console.error(
                        colors.red(
                            `Could not create ${fileName}: ${err.message}`,
                        ),
                    );
                }
            };
            const fileExists = existsSync(
                join(serviceContext.serviceDirectory, fileName),
            );
            // Run if the file doesn't exist or if `overwrite` is true.
            if (!fileExists || options.overwrite)
                return createFile(!!options.overwrite);
            // Warn the user about the overwrite
            console.log(
                colors.yellow(
                    `${SYMBOLS.WARNING} ${join(
                        serviceContext.serviceDirectory,
                        fileName,
                    )} is about to be overwritten.`,
                ),
            );
            console.log();
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Confirm overwrite?',
                        name: 'confirm',
                        default: false,
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    createFile();
                });
        });
};
