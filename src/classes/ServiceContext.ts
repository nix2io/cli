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
import { ServiceContextType } from '../types';
import ServiceFile from './ServiceFile';
import { dirname, join, resolve } from 'path';
import path = require('path');
import { getServiceContextPath, titleCase } from '../util';
import inquirer = require('inquirer');
import { user } from '../user';
import { getEnvironment } from '../environments';
import Environment from './Environment';

export default abstract class ServiceContext {
    static NAME: string;
    static DIRNAME: string = __dirname;
    public selectedEnvironmentName: string;
    public environment: Environment;

    /**
     * Abstract class to represent a service context
     * @class ServiceContext
     * @abstract
     * @param {ServiceFile}   serviceFile path to the service.yaml
     * @param {Info}          info        info of the service
     * @param {string}        type        type of service
     * @param {Array<Schema>} schemas     list of service schemas
     */
    constructor(
        private serviceFile: ServiceFile,
        public info: Info,
        public type: string,
        public schemas: Schema[],
    ) {
        this.selectedEnvironmentName = getEnvironment();
        this.environment = new Environment(this);
        this.info.serviceContext = this;
    }

    /**
     * Returns the service directory
     * @memberof ServiceContext
     * @protected
     * @returns {string} Path to the directory
     */
    get serviceDirectory(): string {
        return dirname(this.serviceFile.path);
    }

    /**
     * Return the inital data for the base Service Context
     * @param options Options given by the cli
     * @param user    User object
     */
    static getInitializeData(options: any, user: any) {
        const authed = user != null,
            serviceIdentifier = path.basename(getServiceContextPath(options)),
            serviceLabel = titleCase(serviceIdentifier.replace(/-/g, ' ')),
            serviceDescription = 'A Nix² Service';
        const data: Record<
            string,
            {
                value: string | boolean;
                prompt: inquirer.Question;
            }
        > = {
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

    static createObject(
        data: {
            identifier: string;
            label: string;
            description: string;
            userLeadDev: boolean;
        },
        user: any,
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
        if (data.userLeadDev) {
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
     * Serialize a ServiceContext instance into an object
     * @function serialize
     * @memberof ServiceContext
     * @returns  {ServiceContextType} Javascript object
     */
    serialize(): ServiceContextType {
        return {
            info: this.info.serialize(),
            type: this.type,
            schemas: this.schemas.map((s) => s.serialize()),
        };
    }

    /**
     * Writes the current ServiceContext from memory to disk
     * @function write
     * @memberof ServiceContext
     * @returns  {boolean} `true` if successfull
     */
    write(): boolean {
        this.serviceFile.YAWNObject.json = this.serialize();
        const content = this.serviceFile.YAWNObject.yaml;
        fs.writeFileSync(this.serviceFile.path, content);
        return true;
    }

    /**
     * Get a schema based on the `identifier`
     * @function getSchema
     * @memberof ServiceContext
     * @param   {string} identifier Identifier of the `Schema` to get
     * @returns {Schema}            `Schema` to return
     */
    getSchema(identifier: string): Schema | null {
        const match = this.schemas.filter((s) => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    /**
     * Adds a `Schema` based off a `Schema` object
     * @function addSchema
     * @memberof ServiceContext
     * @param   {Schema} schema `Schema` to add
     * @returns {Schema}        returns the `Schema` given
     */
    addSchema(schema: Schema): Schema {
        if (this.getSchema(schema.identifier) != null)
            throw new Error('Schema with the same identifier already exists');
        this.schemas.push(schema);
        return schema;
    }

    /**
     * Removes a `Schema` from it's `identifier`
     * @function removeSchema
     * @memberof ServiceContext
     * @param    {string} identifier `identifier` of the `Schema` to remove
     * @returns  {boolean}           `true` if the `Schema` was removed
     */
    removeSchema(identifier: string): boolean {
        const schema = this.getSchema(identifier);
        if (schema == null) return false;
        this.schemas.splice(this.schemas.indexOf(schema), 1);
        return true;
    }

    getTemplate(scope: string, fileName: string) {
        const templatePath = join(
            __dirname,
            `services/${scope}/templates/`,
            `${fileName}.template`,
        );
        return fs.readFileSync(templatePath, 'utf-8');
    }

    getREADMELines(): string[] {
        return [
            '<p align="center"><img height="220px" src="https://i.imgur.com/48BeKfE.png" alt="Logo" /><p>\n',
            `<p align="center">\n\t<strong>${this.info.label}</strong><br />\n\t<sub>${this.info.description}</sub>\n</p>`,
        ];
    }

    createREADME(): void {
        const READMEContent = this.getREADMELines().join('\n');
        console.log(READMEContent);

        fs.writeFileSync(
            join(this.serviceDirectory, 'README.md'),
            READMEContent,
        );
    }

    getFileHeaderLines(file: string): string[] {
        let lines = [
            `File: ${file}`,
            `Created: ${new Date().toISOString()}`,
            '----',
            'Copyright: 2020 Nix² Technologies',
        ];
        if (user != null) {
            lines.push(`Author: ${user.name} (${user.email})`);
        }
        return lines;
    }

    postInitLogic(): void {
        this.createREADME();
    }

    postVersionBump(): void {}
}
