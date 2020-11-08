import * as commander from 'commander';
import colors = require('colors');
import { getServiceContext } from '../../service';
import { TypescriptServiceContext } from '../../classes';
import { ERRORS, SYMBOLS } from '../../constants';
import { prettyPrint } from '../../util';
import { join } from 'path';
import inquirer = require('inquirer');

export const pkg = (make: commander.Command): void => {
    make.command('package')
        .alias('pkg')
        .description('make a package.json')
        // confirm add flag
        .option('-y, --yes', 'skip the confirmation screen')
        .action((options) => {
            // make sure there is a service context
            const serviceContext = getServiceContext(options);
            if (serviceContext == null)
                return console.error(colors.red(ERRORS.NO_SERVICE_EXISTS));
            if (!(serviceContext instanceof TypescriptServiceContext)) {
                return console.error(
                    colors.red(ERRORS.SERVICE_NOT_OF_TYPESCRIPT),
                );
            }
            if (serviceContext.readPackageFile() != null)
                return console.error(colors.red(ERRORS.PACKAGE_EXISTS));

            const createPackageFile = () => {
                try {
                    serviceContext.createPackageFile();
                    console.log(
                        colors.green(`${SYMBOLS.CHECK} Created package.json`),
                    );
                } catch (err) {
                    console.error(
                        colors.red(
                            `Could not create package.json: ${err.message}`,
                        ),
                    );
                }
            };

            if (options.yes) return createPackageFile();

            // prompt the user for confirmation
            console.log(
                colors.yellow(
                    `${SYMBOLS.WARNING} Creating ${join(
                        serviceContext.serviceDirectory,
                        'package.json',
                    )}`,
                ),
            );

            prettyPrint(serviceContext.makePackageContent());
            console.log();
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with adding file?',
                        name: 'confirm',
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    createPackageFile();
                });
        });
};
