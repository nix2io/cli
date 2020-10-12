import { CommanderStatic } from 'commander';
import inquirer = require('inquirer');
import { ERRORS, SERVICE_FILE_NAME } from '../constants';
import { getServiceContext } from '../service';
import { titleCase } from '../util';
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const colors = require('colors');


export default (program: CommanderStatic) => {
    
    program
        .command('init [dirname]')
        .description('initialize a service')
        .option('-y, --yes', 'skip the confirm message')
        .action((dirname: string, options) => {
            // check if a service context exists
            if (getServiceContext() != null) return console.error(ERRORS.SERVICE_EXISTS);
            const skipConfirm = options.yes;
            // get the name of the service
            if (dirname == null) dirname = '.';
            let servicePath       = path.join(process.cwd(), dirname),
                serviceIdentifier = path.basename(servicePath),
                serviceLabel      = titleCase(serviceIdentifier.replace(/-/g, ' ')); 
            // create the questions
            let theData = {
                identifier: serviceIdentifier,
                label: serviceLabel,
                description: 'A Nix² Service',
                version: '1.0.0',
                license: 'CC',
                termsOfServiceURL: 'nix2.io',
                authors: []
            }

            const initialize = () => {
                // let newServiceFilePath = path.join(servicePath, SERVICE_FILE_NAME);
                // fs.writeFileSync(newServiceFilePath, yaml.safeDump(data));
                console.log(colors.green('✔ Service initialized'));
            }
            
            if (skipConfirm) return initialize(); 

            let excudedPrompts = new Set([
                'license',
                'termsOfServiceURL',
                'authors'
            ]);
            // create the questions for inquirer
            let questions: {}[] = [];
            let k: keyof typeof theData;
            for (k in theData) {
                if (excudedPrompts.has(k)) continue;
                let value = theData[k];
                questions.push({
                    type: 'input',
                    message: titleCase(k),
                    name: k,
                    default: value
                });
            }
            
            // questions.push({
            //     type: 'input',
                
            // })


            inquirer
                .prompt(questions)
                .then((info: any) => {
                    const confirmCreate = options.yes;
                    info = {...theData, ...info};

                    let data = {
                        info: info,
                        type: 'app'
                    }

                    if (confirmCreate) return initialize();
                    
                    console.log(data);

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
                            let confirm = answer.confirm;
                            if (!confirm) {
                                console.log(ERRORS.ABORT);
                                return;
                            }
                            initialize();
                        });


                })



        })
}