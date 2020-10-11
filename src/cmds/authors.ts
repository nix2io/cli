import { CommanderStatic } from "commander";
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
        
        console.log(authorData);
        console.log(cachedAuthor);
        
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
    
    let authors = program.command('authors')

    authors.action(displayAuthors);

    authors.command('list')
        .action(displayAuthors);

    // TODO: refactor the same way as remove author
    authors.command('add <email>')
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
        .option('-y, --yes', 'confirm add')
        .action((email: string, options) => {

            let name = options.authorName || null,
                publicEmail = options.publicEmail || null,
                url = options.url || null,
                alert = options.alert || "none",
                flags: Set<string> = new Set(),
                confirmAdd = options.yes;
            
            if (options.public) flags.add('public');
            if (options.dev) flags.add('dev');
            if (options.ldev) flags.add('leadDev');
            if (options.support) flags.add('support');

            let author = {
                email,
                name,
                publicEmail,
                url,
                alert,
                flags
            };

            const createAuthorFromData = (author: any) => {
                // get the service context
                let serviceContext = getServiceContext();
                // check if the service.yaml exists
                if (serviceContext == null) {
                    console.error(colors.red('No service context'));
                    return;
                }
                // check for an author with the same email
                if (serviceContext.info.getAuthor(author.email) != null){
                    console.error(colors.red('Error: Author with the same email exists'));
                    return;
                }

                const addAuthor = () => {
                    // die if there is no service context
                    if (serviceContext == null) { console.error("DEBUG THIS"); return };
    
                    // try to add the author
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
                    let cachedAuthors = cache.get('authors');
                    author.flags = Array.from(author.flags);
                    cachedAuthors[email] = author;
                    cache.set('authors', cachedAuthors);

                }

                if (confirmAdd) {
                    addAuthor();
                    return;
                }

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
    
                        addAuthor();
                    })

            }

            if (name == undefined) {
                getAuthorData(author, (data: object) => {
                    createAuthorFromData(data);    
                });
                return;
            }
            createAuthorFromData(author);
            
        })

    authors.command('remove <email>')
        .option('-y, --yes', 'confirm you want to delete the author')
        .action((email: string, options) => {
            const serviceContext = getServiceContext();
            if (serviceContext == null) { console.error(colors.red('No service context')); return; }
            const confirmRemove = options.yes;
            const author = serviceContext.info.getAuthor(email);
            // check if the author exists
            if (author == null) { console.error(colors.red('Author does not exists')); return; }

            const removeAuthor = () => {
                serviceContext.info.removeAuthor(email);
                serviceContext.write();
                console.log(colors.green(`✔ Author ${email} removed`));
            }

            if (confirmRemove) { removeAuthor(); return } 
            // prompt the user for confirmation
            console.log(colors.yellow("⚠  About to write to service.yaml\n"));

            console.log(author.serialize(), "\n");
            
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
                    if (!confirm) {
                        console.log(ERRORS.ABORT);
                        return;
                    }
                    removeAuthor();
                });
        })
}
