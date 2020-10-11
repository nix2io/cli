import { CommanderStatic } from "commander";
import { ERRORS } from '../constants';
const inquirer = require('inquirer');
const colors = require('colors');


const getAuthorData = (email: string, callback: Function) => {
    console.log(email);
    callback({
        email: email,
        name: 'max koon',
        publicEmail: 'koon@nix2.io',
        flags: ['developer'],
        alert: '*'
    });
} 


export default (program: CommanderStatic) => {
    
    let authors = program.command('authors')

    authors.action(() => {
        console.log('list authors');
        
    })

    authors.command('add <email>')
        .option('-n, --authorName [name]', 'name of the author')
        .option('-E, --publicEmail [publicEmail]', 'email to use for the public')
        .option('-u, --url [url]', 'author url')
        .option('-a, --alert [alert]', 'alert options')
        // flags
        .option('-p, --public', 'set the public flag', false)
        .option('-d, --dev', 'developer flag', true)
        .option('-ld, --ldev', 'lead dev flag', false)
        .option('-s, --support', 'support flag')
        .action((email: string, options) => {

            let name = options.authorName,
                publicEmail = options.publicEmail,
                url = options.url,
                alert = options.alert;

            let author = {
                name,
                email,
                publicEmail,
                url,
                alert
            };

            const createAuthorFromData = (author: object) => {
    
                console.log(colors.yellow("⚠  About to write to service.yaml\n"));
    
                console.log(author, "\n");
    
                inquirer
                    .prompt([
                        {
                            type: 'confirm',
                            message: 'Proceed with adding author?',
                            name: 'confirm'
                        }
                    ])
                    .then((answer: any) => {
                        let confirm = answer.confirm;
                        if (!confirm) {
                            console.log(ERRORS.ABORT);
                            return;
                        }
    
                        // TODO: implement adding author code
    
                    })

            }

            if (name == undefined) {
                console.log('collecting external data');
                getAuthorData(email, (data: object) => {
                    createAuthorFromData(data);    
                });
                return;
            }
            createAuthorFromData(author);
            
        })

}
