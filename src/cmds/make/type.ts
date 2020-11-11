/*
 * File: type.ts
 * Created: 10/21/2020 13:38:14
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as commander from 'commander';

import { OptionalKind, Project, PropertyDeclarationStructure } from 'ts-morph';

import { getService } from '../../service';

import colors = require('colors');
import path = require('path');

export default (make: commander.Command): void => {
    make.command('type <schema>')
        .description('make a type')
        .action((schemaIdentifier: string, options) => {
            // make sure there is a service context
            const serviceContext = getService(options);
            if (serviceContext == null)
                return console.error(colors.red('No service context found'));
            // get the specified schema
            const schema = serviceContext.getSchema(schemaIdentifier);
            if (schema == null)
                return console.error(
                    colors.red(
                        `Schema with the id: "${schemaIdentifier}" was not found`,
                    ),
                );

            // Create the project instance from ts-morph
            const project = new Project();
            const projectPath = path.join(process.cwd(), 'serv/');
            project.addSourceFilesAtPaths(path.join(projectPath, '/**/*.ts'));

            const typeFile = project.createSourceFile(
                path.join(projectPath, `/types/${schema.pascalCase}.ts`),
                `export class ${schema.pascalCase} {}`,
            );

            typeFile.addImportDeclarations([
                {
                    namedImports: ['ObjectType', 'Field', 'ID'],
                    moduleSpecifier: 'type-graphql',
                },
            ]);

            const schemaClass = typeFile.getClass(schema.pascalCase);

            if (schemaClass == null) throw Error('sdfs');

            if (schema.description != null)
                schemaClass.addJsDoc(
                    `${schema.description}\n@class ${schema.pascalCase}`,
                );

            schemaClass.addDecorator({
                name: 'ObjectType',
                arguments: [],
            });
            const newProperties: OptionalKind<
                PropertyDeclarationStructure
            >[] = [];
            let fieldIndex = 0;

            for (const fieldName in schema.fields) {
                const field = schema.fields[fieldName];
                const args: string[] = [];
                if (fieldName == '_id') {
                    args.push('type => ID');
                }
                newProperties.push({
                    docs:
                        field.description != null
                            ? [field.description]
                            : undefined,
                    name: fieldName,
                    type: field.type,
                    leadingTrivia:
                        fieldIndex != 0
                            ? (writer) => writer.newLine()
                            : undefined,
                    decorators: [
                        {
                            name: 'Field',
                            arguments: args,
                        },
                    ],
                });
                fieldIndex++;
            }
            schemaClass.addProperties(newProperties);

            project.saveSync();
        });
};
