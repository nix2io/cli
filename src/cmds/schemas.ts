import { CommanderStatic } from "commander";
import { getServiceContext } from "../service";
import { ERRORS, NONE } from "../constants";
import inquirer = require("inquirer");
import { prettyPrint, titleCase } from "koontil";
import Schema from "../classes/Schema";
const colors = require('colors');
const Table = require('cli-table');
const pluralize = require('pluralize');


const displaySchemas = () => {
    const serviceContext = getServiceContext();
    if (serviceContext == null) { console.error(colors.red('No service context')); return; }

    let table = new Table({ head: ['ID', 'Label', 'Description'], style: { head: ['cyan', 'bold'] } });
    for (let schema of serviceContext.schemas) {
        table.push([ schema.identifier, schema.label || NONE, schema.description || NONE ]);
    }
    let schemaCount = serviceContext.schemas.length;

    console.log(`Displaying ${colors.bold(`${schemaCount} schema${schemaCount != 1 ? 's' : ''}`)}`);
    console.log(table.toString());
}

const createSchemaObject = (identifier: string, options: any) => {
    if (0) console.log(options);
    return {
        identifier: identifier,
        label: titleCase(identifier.replace(/_/g, " ")),
        pluralName: pluralize.plural(identifier),
        description: options.desc || null
    }

}

export default (program: CommanderStatic) => {
    
    const schemas = program.command('schemas')
        .alias('schema')
        .description('manage the service schemas')
        .action(displaySchemas);
    
    schemas.command('list')
        .description('list all the schemas')
        .action(displaySchemas);

    schemas.command('add <identifier>')
        .description('add a schema')
        .option('-y, --yes', 'skip the confirmation message')
        .option('-d, --desc [description]', 'description of the schema')
        .action((identifier: string, options: any) => {


            // TODO: implement something like this
            
            // dev schema add artist,page
            
            // dev schema add artist->album->song
            // will create artist
            // album will have artistId
            // song will have songId
            // these will be links


            // dev schema add user->page,otherThing

            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null) return console.error(colors.red('No service context'));
            const confirmAdd = options.yes;
            
            // check if the schema already exists
            if (serviceContext.getSchema(identifier) != null) return console.error(colors.red('A schema with the same identifier exists'));
            
            // define the schema object
            const schema = createSchemaObject(identifier, options);

            // logic for adding schemas
            const addSchema = () => {
                // try to add the schema to the local service context
                try {
                    let newSchema = new Schema(schema.identifier, schema.label, schema.description, schema.pluralName, {});
                    serviceContext.addSchema(newSchema);
                } catch (err) { return console.error(colors.red(`Error creating schema: ${err.message}`)) };

                // try to write the service.yaml
                try {
                    serviceContext.write();
                    console.log(colors.green(`✔ Schema ${schema.identifier} added`));
                } catch (err) { return console.error(colors.red('Error saving service.yaml: ' + err.message)); }
            }

            // add the schema if confirm
            if (confirmAdd) return addSchema(); 
            
            // prompt the user for confirmation
            console.log(colors.yellow("⚠  About to write to service.yaml"));
            prettyPrint(schema);
            console.log("\n");
            
            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with adding the schema?',
                        name: 'confirm'
                    }
                ])
                .then((answer: any) => {
                    if (!answer.confirm) return console.log(ERRORS.ABORT);
                    addSchema();
                });
        });

    schemas.command('remove <identifier>')
        .description('remove a schema')
        .option('-y, --yes', 'skip the confirmation message')
        .action((identifier: string, options: any) => {
            // check if there is a service context
            const serviceContext = getServiceContext();
            if (serviceContext == null) return console.error(colors.red('No service context'));
            const confirmRemove = options.yes;
            
            // check if the schema exists
            const schema = serviceContext.getSchema(identifier);
            if (schema == null) return console.error(colors.red('Schema does not exists'));
            
            // logic for schema removal
            const removeSchema = () => {
                serviceContext.removeSchema(identifier);
                serviceContext.write();
                console.log(colors.green(`✔ Schema ${identifier} removed`));
            }
            
            // remove the schema if confirm
            if (confirmRemove) return removeSchema(); 
            
            // prompt the user for confirmation
            console.log(colors.yellow("⚠  About to write to service.yaml"));
            prettyPrint(schema.serialize());
            console.log("\n");
            
            // get the user response
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Proceed with removing schema?',
                        name: 'confirm',
                        default: false
                    }
                ])
                .then((answer: any) => {
                    let confirm = answer.confirm;
                    if (!confirm) return console.log(ERRORS.ABORT);
                    removeSchema();
                });          
        });
    
}