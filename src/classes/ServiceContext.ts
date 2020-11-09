/*
 * File: ServiceContext.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import Info from './Info';
import Schema from './Schema';
import yaml = require('js-yaml');
import fs = require('fs');
import { Obj, ServiceContextType, MakeObjectType } from '../types';
import { dirname, join } from 'path';
import path = require('path');
import { getServiceContextPath, titleCase } from '../util';
import inquirer = require('inquirer');
import { user } from '../user';
import { readCurrentEnvironmentName } from '../environments';
import { Environment, User } from '.';
import { EDITOR_TYPES, GIT_IGNORE_SERVICE_BASE_URL } from '../constants';
import Axios from 'axios';

type QuestionType = Record<
    string,
    {
        value: string | boolean;
        prompt: inquirer.Question;
    }
>;

/**
 * Abstract class to represent a service context.
 * @class ServiceContext
 * @abstract
 */
export default abstract class ServiceContext {
    static NAME: string;
    static DIRNAME: string = __dirname;
    public selectedEnvironmentName: string;
    public environment: Environment;

    /**
     * Constructor for the `ServiceContext`.
     * @param {string}        serviceFilePath Path to the service.yaml.
     * @param {Info}          info            Info of the service.
     * @param {string}        type            Type of service.
     * @param {Array<Schema>} schemas         List of service schemas.
     */
    constructor(
        private serviceFilePath: string,
        public info: Info,
        public type: string,
        public schemas: Schema[],
    ) {
        this.selectedEnvironmentName = readCurrentEnvironmentName();
        this.environment = new Environment(this);
        this.info.serviceContext = this;
    }

    /**
     * Returns the service directory.
     * @memberof ServiceContext
     * @protected
     * @returns {string} Path to the directory.
     */
    get serviceDirectory(): string {
        return dirname(this.serviceFilePath);
    }

    /**
     * Return the inital data for the base Service Context.
     * @param {Obj}  options Options given by the CLI.
     * @param {User} user    User object.
     * @returns {QuestionType} Object of questions for inquierer.js.
     */
    static getInitializeData(options: Obj, user: User | null): QuestionType {
        const authed = user != null,
            serviceIdentifier = path.basename(getServiceContextPath(options)),
            serviceLabel = titleCase(serviceIdentifier.replace(/-/g, ' ')),
            serviceDescription = 'A Nix² Service';
        const data: QuestionType = {
            identifier: {
                value: serviceIdentifier,
                prompt: {
                    type: 'input',
                    message: 'Identifier',
                    name: 'identifier',
                    default: serviceIdentifier,
                },
            },
            label: {
                value: serviceLabel,
                prompt: {
                    type: 'input',
                    message: 'Label',
                    name: 'label',
                    default: serviceLabel,
                },
            },
            description: {
                value: serviceDescription,
                prompt: {
                    type: 'input',
                    message: 'Description',
                    name: 'description',
                    default: serviceDescription,
                },
            },
        };
        if (authed) {
            data.makeLeadDev = {
                value: true,
                prompt: {
                    type: 'confirm',
                    message: 'Make you the lead dev?',
                    name: 'userLeadDev',
                },
            };
        }
        return data;
    }

    /**
     * Make a `ServiceContext` object.
     * @static
     * @param {MakeObjectType} data Data for the `ServiceContext` object.
     * @param {User}           user User instance.
     * @returns {ServiceContextType} New `ServiceContext` object.
     */
    static makeObject(
        data: MakeObjectType,
        user: User | null,
    ): ServiceContextType {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        const serviceObject: ServiceContextType = {
            info: {
                identifier: data.identifier,
                label: data.label,
                description: data.description,
                version: '1.0.0',
                authors: [],
                created: currentTimestamp,
                modified: currentTimestamp,
                license: 'CC-BY-1.0',
                termsOfServiceURL: 'nix2.io/tos',
            },
            schemas: [],
            type: 'app',
        };
        if (data.userLeadDev && user != null) {
            serviceObject.info.authors.push({
                email: user.email,
                name: user.name,
                publicEmail: null,
                url: null,
                alert: '*',
                flags: ['leadDev'],
            });
        }
        return serviceObject;
    }

    /**
     * Serialize a ServiceContext instance into an object.
     * @function serialize
     * @memberof ServiceContext
     * @returns  {ServiceContextType} Javascript object.
     */
    serialize(): ServiceContextType {
        return {
            info: this.info.serialize(),
            type: this.type,
            schemas: this.schemas.map((s) => s.serialize()),
        };
    }

    /**
     * Writes the current ServiceContext from memory to disk.
     * @function write
     * @memberof ServiceContext
     * @returns  {boolean} `true` if successfull.
     */
    write(): boolean {
        fs.writeFileSync(this.serviceFilePath, yaml.safeDump(this.serialize()));
        return true;
    }

    /**
     * Get a schema based on the `identifier`.
     * @function getSchema
     * @memberof ServiceContext
     * @param   {string} identifier Identifier of the `Schema` to get.
     * @returns {Schema}            `Schema` to return.
     */
    getSchema(identifier: string): Schema | null {
        const match = this.schemas.filter((s) => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    /**
     * Adds a `Schema` based off a `Schema` object.
     * @function addSchema
     * @memberof ServiceContext
     * @param   {Schema} schema `Schema` to add.
     * @returns {Schema}        The given `Schema`.
     */
    addSchema(schema: Schema): Schema {
        if (this.getSchema(schema.identifier) != null)
            throw new Error('Schema with the same identifier already exists');
        this.schemas.push(schema);
        return schema;
    }

    /**
     * Removes a `Schema` from it's `identifier`.
     * @function removeSchema
     * @memberof ServiceContext
     * @param    {string} identifier `identifier` of the `Schema` to remove.
     * @returns  {boolean}           `true` if the `Schema` was removed.
     */
    removeSchema(identifier: string): boolean {
        const schema = this.getSchema(identifier);
        if (schema == null) return false;
        this.schemas.splice(this.schemas.indexOf(schema), 1);
        return true;
    }

    /**
     * Read the contents of the template file.
     * @function readTemplate
     * @memberof ServiceContext
     * @example
     * // Returns the file content for main.py
     * serviceContext.getTemplate('ServiceContextType', 'main.py') // app.run('0.0.0.0', port=80)
     * @param   {string} scope    Scope of the service context.
     * @param   {string} fileName Template name.
     * @returns {string}          Template contents.
     */
    readTemplate(scope: string, fileName: string): string {
        const templatePath = join(
            __dirname,
            `services/${scope}/templates/`,
            `${fileName}.template`,
        );
        return fs.readFileSync(templatePath, 'utf-8');
    }

    /**
     * Make the lines for the README file.
     * @function getREADMELines
     * @memberof ServiceContext
     * @returns {string[]} Array of lines for the README.
     */
    makeREADMELines(): string[] {
        return [
            '<p align="center"><img height="220px" src="https://i.imgur.com/48BeKfE.png" alt="Logo" /><p>\n',
            `<p align="center">\n\t<strong>${this.info.label}</strong><br />\n\t<sub>${this.info.description}</sub>\n</p>`,
        ];
    }

    /**
     * Create the README.md file.
     * @function createREADME
     * @memberof ServiceContext
     * @returns {void}
     */
    createREADME(): void {
        const READMEContent = this.makeREADMELines().join('\n');
        fs.writeFileSync(
            join(this.serviceDirectory, 'README.md'),
            READMEContent,
        );
    }

    /**
     * Makes the lines for file headers.
     * @function getFileHeaderLines
     * @memberof ServiceContext
     * @example
     * // Example: returns file header for main.py
     * serviceContext.getFileHeaderLines('main.py') // ['File: main.py', ...]
     * @param   {string}   fileName Name of the file.
     * @returns {string[]}          Lines for file headers.
     */
    makeFileHeaderLines(fileName: string): string[] {
        const lines = [
            `File: ${fileName}`,
            `Created: ${new Date().toISOString()}`,
            '----',
            'Copyright: 2020 Nix² Technologies',
        ];
        if (user != null) {
            lines.push(`Author: ${user.name} (${user.email})`);
        }
        return lines;
    }

    /**
     * Make the ingore components to get sent to the ignore generation service.
     * @function makeIgnoreComponents
     * @memberof ServiceContext
     * @returns {string[]} Ignore components.
     */
    makeIgnoreComponents(): string[] {
        return ['git'].concat(EDITOR_TYPES);
    }

    /**
     * Create the .gitignore file.
     * @function createGitIgnore
     * @memberof ServiceContext
     * @returns {void}
     */
    async createGitIgnore(): Promise<void> {
        const ignoreComponents = this.makeIgnoreComponents();
        const url = GIT_IGNORE_SERVICE_BASE_URL + ignoreComponents.join(',');
        Axios.get(url)
            .then((response) => {
                const ignoreContent = response.data;
                fs.writeFileSync(
                    join(this.serviceDirectory, '.gitignore'),
                    ignoreContent,
                );
            })
            .catch((err) => {
                console.error('could not create .gitignore');
                throw err;
            });
    }

    /**
     * Creates ignore files.
     * @function createIgnoreFiles
     * @memberof ServiceContext
     * @returns {void}
     */
    createIgnoreFiles(): void {
        this.createGitIgnore();
    }

    /**
     * Event listener for after an initialization.
     * @function postInit
     * @memberof ServiceContext
     * @returns {void}
     */
    postInit(): void {
        this.createREADME();
        this.createIgnoreFiles();
    }

    /**
     * Event listener for after a version bump.
     * @function postVersionBump
     * @memberof ServiceContext
     * @returns {void}
     */
    postVersionBump(): void {
        return;
    }
}
