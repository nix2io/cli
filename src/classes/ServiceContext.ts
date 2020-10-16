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
    constructor(
        private filePath: string,
        public info: Info,
        public type: string,
        public schemas: Schema[]
    ) { }

    // @ts-ignore
    static deserialize(serviceFilePath: string, data: { [key: string]: any }): ServiceContext {
        throw Error("NOT IMPLEMENTED");
        console.log(serviceFilePath, data);
    }

    serialize(): { [key: string]: any } {
        return {
            info: this.info.serialize(),
            type: this.type,
            schemas: this.schemas.map(s => s.serialize())
        }
    }

    write(): boolean {
        const s = this.serialize();
        const content = yaml.safeDump(s);
        fs.writeFileSync(this.filePath, content);
        return true;
    }

    getSchema(identifier: string): Schema | null {
        const match = this.schemas.filter(s => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    addSchema(schema: Schema): Schema {
        if (this.getSchema(schema.identifier) != null) throw new Error("Schema with the same identifier already exists");
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