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

export default abstract class ServiceContext {
    /**
     * Abstract class to represent a service context
     * @class ServiceContext
     * @abstract
     * @param {string}        filePath path to the service.yaml
     * @param {Info}          info     info of the service
     * @param {string}        type     type of service
     * @param {Array<Schema>} schemas  list of service schemas
     */
    constructor(
        private filePath: string,
        public info: Info,
        public type: string,
        public schemas: Schema[],
    ) {}

    /**
     * Deserialize an object into a `ServiceContext` instance
     * @function deserialize
     * @static
     * @memberof ServiceContext
     * @param   {string} serviceFilePath path to the service.yaml
     * @param   {object} data            Javascript object of the Info
     * @returns {ServiceContext}         Service context object
     */
    static deserialize(
        serviceFilePath: string,
        data: ServiceContextType,
    ): ServiceContext {
        throw Error('NOT IMPLEMENTED');
        console.log(serviceFilePath, data);
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
        const s = this.serialize();
        const content = yaml.safeDump(s);
        fs.writeFileSync(this.filePath, content);
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
}
