/*
 * File: schemas.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommanderStatic } from 'commander';
import { getServiceContext } from '../service';
import { ERRORS, NONE } from '../constants';
import inquirer = require('inquirer');
import { prettyPrint, titleCase } from 'koontil';
import { Schema, ServiceContext } from '../classes';
import colors = require('colors');
import Table = require('cli-table');
import pluralize = require('pluralize');
import { parseRelationship } from './parsers';
import { CommandContext } from './parsers/relationship/classes';
import { FieldType, SchemaType } from '../types';

const displaySchemas = (): void => {
    const serviceContext = getServiceContext();
    if (serviceContext == null) {
        console.error(colors.red('No service context'));
        return;
    }

    const table = new Table({
        head: ['ID', 'Label', 'Description'],
        style: { head: ['cyan', 'bold'] },
    });
    for (const schema of serviceContext.schemas) {
        table.push([
            schema.identifier,
            schema.label || NONE,
            schema.description || NONE,
        ]);
    }
    const schemaCount = serviceContext.schemas.length;

    console.log(
        `Displaying ${colors.bold(
            `${schemaCount} schema${schemaCount != 1 ? 's' : ''}`,
        )}`,
    );
    console.log(table.toString());
};

const createSchemaObject = (
    serviceContext: ServiceContext,
    identifier: string,
    options: Record<string, string | null>,
    context: CommandContext,
): SchemaType => {
    const fields: { [key: string]: FieldType } = {};
    const schemaLabel = titleCase(identifier.replace(/_/g, ' '));

    if (context.linked.hasParents(identifier)) {
        for (const parent of context.linked.getParents(identifier)) {
            const fieldName = parent + 'Id';
            const label = `${titleCase(parent)} ID`;
            const description = `The ${schemaLabel}'s ${titleCase(
                parent,
            )} identifier.`;
            fields[fieldName] = {
                label,
                description,
                type: 'number',
                required: true,
                default: null,
                flags: ['relation'],
            };
        }
    }
    return {
        identifier: identifier,
        label: schemaLabel,
        pluralName: pluralize.plural(identifier),
        description:
            options.desc || `A ${serviceContext.info.label} ${schemaLabel}`,
        fields,
    };
};

const getSchemaCreationContext = (query: string): CommandContext | null => {
    try {
        const [context, error] = parseRelationship(query);
        if (error != null) {
            console.log();
            const arrows = colors.red.bold(
                Array(error.positionStart + 1).join(' ') +
                    Array(error.positionEnd - error.positionStart + 1).join(
                        '~',
                    ),
            );
            console.error(
                `${colors.red('Aborted Operation')} ${error.errorName}: ${
                    error.details
                }\n\n${query}\n${arrows}\n`,
            );
            return null;
        }
        if (context == null) throw Error('context is not and should not be');
        return context;
    } catch (e) {
        console.error(`Aborted Operation ${e}`);
        return null;
    }
};

export default (program: CommanderStatic): void => {
    const schemas = program
        .command('schemas')
        .alias('schema')
        .description('manage the service schemas')
        .action(displaySchemas);

    schemas
        .command('list')
        .description('list all the schemas')
        .action(displaySchemas);

    schemas
        .command('add <identifier>')
        .description('add a schema')
        .option('-y, --yes', 'skip the confirmation message')
        .option('-d, --desc [description]', 'description of the schema')
        .action((query: string, options) => {
            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null)
                return console.error(colors.red('No service context'));
            const confirmAdd = options.yes;

            const context = getSchemaCreationContext(query);
            if (context == null) return;

            const newSchemas: SchemaType[] = [];

            for (const identifier of context.schemas) {
                // check if the schema already exists
                if (serviceContext.getSchema(identifier) != null)
                    return console.error(
                        colors.red(
                            `A schema with the identifier '${identifier}' already exists`,
                        ),
                    );

                // define the schema object
                newSchemas.push(
                    createSchemaObject(
                        serviceContext,
                        identifier,
                        options,
                        context,
                    ),
                );
            }

            // logic for adding schemas
            const addSchemas = () => {
                const newSchemaIDS: string[] = [];
                for (const schema of newSchemas) {
                    // try to add the schema to the local service context
                    try {
                        const newSchema = Schema.deserialize(schema);
                        serviceContext.addSchema(newSchema);
                        newSchemaIDS.push(newSchema.identifier);
                    } catch (err) {
                        return console.error(
                            colors.red(`Error creating schema: ${err.message}`),
                        );
                    }
                }
                // try to write the service.yaml
                try {
                    serviceContext.write();
                    console.log(
                        colors.green(
                            `✔ Schemas ${newSchemaIDS.join(', ')} added`,
                        ),
                    );
                } catch (err) {
                    return console.error(
                        colors.red('Error saving service.yaml: ' + err.message),
                    );
                }
            };
            // add the schema if confirm
            if (confirmAdd) return addSchemas();

            // prompt the user for confirmation
            console.log(colors.yellow('⚠  About to write to service.yaml'));
            prettyPrint(newSchemas);
            console.log('\n');

            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with adding the schema?',
                        name: 'confirm',
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    addSchemas();
                });
        });

    schemas
        .command('remove <identifier>')
        .description('remove a schema')
        .option('-y, --yes', 'skip the confirmation message')
        .action((identifier: string, options) => {
            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null)
                return console.error(colors.red('No service context'));
            const confirmRemove = options.yes;

            // check if the schema exists
            const schema = serviceContext.getSchema(identifier);
            if (schema == null)
                return console.error(colors.red('Schema does not exists'));

            // logic for schema removal
            const removeSchema = () => {
                serviceContext.removeSchema(identifier);
                serviceContext.write();
                console.log(colors.green(`✔ Schema ${identifier} removed`));
            };

            // remove the schema if confirm
            if (confirmRemove) return removeSchema();

            // prompt the user for confirmation
            console.log(colors.yellow('⚠  About to write to service.yaml'));
            prettyPrint(schema.serialize());
            console.log('\n');

            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with removing schema?',
                        name: 'confirm',
                        default: false,
                    },
                ])
                .then((answer) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    removeSchema();
                });
        });
};
