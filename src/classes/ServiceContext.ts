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

export default abstract class ServiceContext {
    /**
     *
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
     * Deserialize an object into an `ServiceContext` instance
     * @function deserialize
     * @memberof ServiceContext
     * @param   {string} serviceFilePath path to the service.yaml
     * @param   {object} data            Javascript object of the Info
     * @returns {ServiceContext}         Service context object
     */
    static deserialize(
        serviceFilePath: string,
        data: Record<string, unknown>,
    ): ServiceContext {
        throw Error('NOT IMPLEMENTED');
        console.log(serviceFilePath, data);
    }

    serialize(): Record<string, unknown> {
        return {
            info: this.info.serialize(),
            type: this.type,
            schemas: this.schemas.map((s) => s.serialize()),
        };
    }

    write(): boolean {
        const s = this.serialize();
        const content = yaml.safeDump(s);
        fs.writeFileSync(this.filePath, content);
        return true;
    }

    getSchema(identifier: string): Schema | null {
        const match = this.schemas.filter((s) => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    addSchema(schema: Schema): Schema {
        if (this.getSchema(schema.identifier) != null)
            throw new Error('Schema with the same identifier already exists');
        this.schemas.push(schema);
        return schema;
    }

    removeSchema(identifier: string): boolean {
        const schema = this.getSchema(identifier);
        if (schema == null) return false;
        this.schemas.splice(this.schemas.indexOf(schema), 1);
        return true;
    }
}
