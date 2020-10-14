import { CommanderStatic } from "commander";
import { prettyPrint } from 'koontil';
import { ERRORS } from '../constants';
import cache from '../cache';
import { getServiceContext } from "../service";
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');

// const emptyAuthor = {
//     name: null,
//     alert: null
// }


const getAuthorData = (authorData: { [key: string]: any; }, callback: Function) => {
    const cachedAuthors = cache.get('authors');
    let email = authorData.email;
    if (Object.keys(cachedAuthors).indexOf(email) != -1) {
        let cachedAuthor = cachedAuthors[email]
        authorData = {
            email:       authorData.email       || cachedAuthor.email,
            name:        authorData.name        || cachedAuthor.name        || null,
            publicEmail: authorData.publicEmail || cachedAuthor.publicEmail || null,
            url:         authorData.url         || cachedAuthor.url         || null,
            alert:       authorData.alert       || cachedAuthor.alert       || null,
            flags:       authorData.flags       || cachedAuthor.flags
        };
    }
    callback(authorData);
}

const createAuthorObject = (email: string, options: { [key: string]: any }) => {
    let name = options.authorName || null,
                publicEmail = options.publicEmail || null,
                url = options.url || null,
                alert = options.alert || "none",
                flags: Set<string> = new Set();
    
    if (options.public) flags.add('public');
    if (options.dev) flags.add('dev');
    if (options.ldev) flags.add('leadDev');
    if (options.support) flags.add('support');

    return {
        email,
        name,
        publicEmail,
        url,
        alert,
        flags
    };
}

const colorsStrings = (obj: { [key: string]: any; }) => {
    for (let key in obj) {
        let value = obj[key];
        if (typeof value == "string") value = colors.green(value);
        if (typeof value == "object") value = colorsStrings(value);
        obj[key] = value;
    }
    return obj;
}

const displayAuthors = () => {
    const serviceContext = getServiceContext();
    if (serviceContext == null) { console.error(colors.red('No service context')); return; }

    let table = new Table({ head: ['Email', 'Name', 'Flags'], style: { head: ['cyan', 'bold'] } });
    for (let author of serviceContext.info.authors) {
        table.push([ author.email, author.name, Array.from(author.flags).join(", ") ]);
    }
    let authorCount = serviceContext.info.authors.length;

    console.log(`Displaying ${colors.bold(`${authorCount} author${authorCount != 1 ? 's' : ''}`)}`);
    console.log(table.toString());
}


export default (program: CommanderStatic) => {
    
    let authors = program
        .command('authors')
        .alias('author')
        .description('manage your authors')
        .action(displayAuthors);

    authors.command('list')
        .description('list the service authors')
        .action(displayAuthors);

    // TODO: refactor the same way as remove author
    authors.command('add <email>')
        .description('add an author')
        .option('-n, --authorName [name]', 'name of the author')
        .option('-E, --publicEmail [publicEmail]', 'email to use for the public')
        .option('-u, --url [url]', 'author url')
        .option('-a, --alert [alert]', 'alert options')
        // flags
        .option('-p, --public', 'set the public flag')
        .option('-d, --dev', 'developer flag')
        .option('-D, --ldev', 'lead dev flag')
        .option('-s, --support', 'support flag')
        // confirm add flag
        .option('-y, --yes', 'skip the confirmation screen')
        .action((email: string, options) => {
            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null) return console.error(colors.red('No service context'));
            const confirmAdd = options.yes;
            
            // check if the author already exists
            if (serviceContext.info.getAuthor(email) != null) return console.error(colors.red('An author with the same email exists'));
            
            // define the author object
            const author = createAuthorObject(email, options)
            
            // logic for adding an authors
            const addAuthor = () => {
                // try to add the author to the local service context
                try {
                    serviceContext.info.addAuthor(
                        author.email,
                        author.name,
                        author.publicEmail,
                        author.url,
                        author.alert,
                        author.flags
                    );
                } catch (err) {
                    console.error(err);
                    return;
                }

                // try to write the service.yaml
                try {
                    serviceContext.write();
                    console.log(colors.green(`✔ Author ${author.email} added`));
                } catch (err) {
                    console.error(colors.red('Error saving service.yaml: ' + err.message));
                    return;
                }

                // save the author into cache
                let cachedAuthors = cache.get('authors'),
                    authorCopy: any = Object.assign({}, author);
                authorCopy.flags = Array.from(author.flags);
                cachedAuthors[email] = author;
                cache.set('authors', cachedAuthors);
            }

            // add the author if confirm
            if (confirmAdd) return addAuthor();

            // prompt the user for confirmation
            console.log(colors.yellow("⚠  About to write to service.yaml\n"));
            prettyPrint(author);
            console.log("\n");

            // get the user response
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

                    addAuthor();
                });
        });

    authors.command('remove <email>')
        .description('remove an author')
        .option('-y, --yes', 'skip the confirmation screen')
        .action((email: string, options) => {
            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null) return console.error(colors.red('No service context'));
            const confirmRemove = options.yes;
            
            // check if the author exists
            const author = serviceContext.info.getAuthor(email);
            if (author == null) return console.error(colors.red('Author does not exists'));
            
            // logic for author removal
            const removeAuthor = () => {
                serviceContext.info.removeAuthor(email);
                serviceContext.write();
                console.log(colors.green(`✔ Author ${email} removed`));
            }
            
            // remove the author if confirm
            if (confirmRemove) return removeAuthor(); 
            
            // prompt the user for confirmation
            console.log(colors.yellow("⚠  About to write to service.yaml\n"));
            prettyPrint(author.serialize());
            console.log("\n");
            
            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with removing author?',
                        name: 'confirm',
                        default: false
                    }
                ])
                .then((answer: any) => {
                    let confirm = answer.confirm;
                    if (!confirm) return console.log(ERRORS.ABORT);
                    removeAuthor();
                });
        });
}
