/*
 * File: authors.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as colors from 'colors';
import * as inquirer from 'inquirer';

import { ERRORS, NONE } from '../constants';
import { getRootOptions, prettyPrint } from '../util';

import { CommanderStatic } from 'commander';
import { Obj } from '@nix2/service-core';
import cache from '../cache';
import { getService } from '../service';

import Table = require('cli-table');

const createAuthorObject = (
    email: string,
    options: Record<string, string | null>,
) => {
    const name = options.authorName || null,
        publicEmail = options.publicEmail || null,
        url = options.url || null,
        alert = options.alert || 'none',
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
        flags,
    };
};

const displayAuthors = (options: Obj): void => {
    const serviceContext = getService(options);
    if (serviceContext == null) {
        console.error(colors.red('No service context'));
        return;
    }

    const table = new Table({
        head: ['Email', 'Name', 'Flags'],
        style: { head: ['cyan', 'bold'] },
    });
    for (const author of serviceContext.info.authors) {
        table.push([
            author.email,
            author.name || NONE,
            Array.from(author.flags).join(', ') || NONE,
        ]);
    }
    const authorCount = serviceContext.info.authors.length;

    console.log(
        `Displaying ${colors.bold(
            `${authorCount} author${authorCount != 1 ? 's' : ''}`,
        )}`,
    );
    console.log(table.toString());
};

export default (program: CommanderStatic): void => {
    const authors = program
        .command('authors')
        .alias('author')
        .description('manage your authors')
        .action(displayAuthors);

    authors
        .command('list')
        .description('list the service authors')
        .action(displayAuthors);

    authors
        .command('add <email>')
        .description('add an author')
        .option('-n, --authorName [name]', 'name of the author')
        .option(
            '-E, --publicEmail [publicEmail]',
            'email to use for the public',
        )
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
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(colors.red('No service context'));
            const confirmAdd = options.yes;

            // check if the author already exists
            if (serviceContext.info.getAuthor(email) != null)
                return console.error(
                    colors.red('An author with the same email exists'),
                );

            // define the author object
            const author = createAuthorObject(email, options);

            // logic for adding an authors
            const addAuthor = () => {
                // try to add the author to the local service context
                try {
                    serviceContext.info.createAndAddAuthor(
                        author.email,
                        author.name,
                        author.publicEmail,
                        author.url,
                        author.alert,
                        author.flags,
                    );
                } catch (err) {
                    if (getRootOptions(options).debug) {
                        console.error(err);
                    } else {
                        console.error(colors.red(`ERR: ${err.message}`));
                    }
                    return;
                }

                // try to write the service.yaml
                try {
                    serviceContext.write();
                    console.log(colors.green(`✔ Author ${author.email} added`));
                } catch (err) {
                    return console.error(
                        colors.red('Error saving service.yaml: ' + err.message),
                    );
                }

                // save the author into cache
                const cachedAuthors = cache.get('authors'),
                    authorCopy: Record<string, unknown> = Object.assign(
                        {},
                        author,
                    );
                authorCopy.flags = Array.from(author.flags);
                cachedAuthors[email] = author;
                cache.set('authors', cachedAuthors);
            };

            // add the author if confirm
            if (confirmAdd) return addAuthor();

            // prompt the user for confirmation
            console.log(colors.yellow('⚠  About to write to service.yaml\n'));
            prettyPrint(author);
            console.log('\n');

            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with adding author?',
                        name: 'confirm',
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    addAuthor();
                });
        });

    authors
        .command('remove <email>')
        .description('remove an author')
        .option('-y, --yes', 'skip the confirmation screen')
        .action((email: string, options) => {
            // check if there is a service context
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(colors.red('No service context'));
            const confirmRemove = options.yes;

            // check if the author exists
            const author = serviceContext.info.getAuthor(email);
            if (author == null)
                return console.error(colors.red('Author does not exists'));

            // logic for author removal
            const removeAuthor = () => {
                serviceContext.info.removeAuthor(email);
                serviceContext.write();
                console.log(colors.green(`✔ Author ${email} removed`));
            };

            // remove the author if confirm
            if (confirmRemove) return removeAuthor();

            // prompt the user for confirmation
            console.log(colors.yellow('⚠  About to write to service.yaml\n'));
            prettyPrint(author.serialize());
            console.log('\n');

            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with removing author?',
                        name: 'confirm',
                        default: false,
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    removeAuthor();
                });
        });
};
