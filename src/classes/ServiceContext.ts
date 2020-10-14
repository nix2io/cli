import Info from './Info';
import Schema from './Schema';
const yaml = require('js-yaml');
const fs   = require('fs');


export default class ServiceContext {
    constructor(
        private filePath: string,
        public  info:     Info,
        public  type:     String,
        public  schemas:  Schema[]
    ) {};

    serialize() {
        return {
            info: this.info.serialize(),
            type:    this.type,
            schemas: this.schemas.map(s => s.serialize())
        }
    }

    write() {
        let s = this.serialize();
        let content = yaml.safeDump(s);
        fs.writeFileSync(this.filePath, content);
        return true;
    }

    getSchema(identifier: string): Schema|null {
        let match = this.schemas.filter(s => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    addSchema(schema: Schema) {
        if (this.getSchema(schema.identifier) != null) throw new Error("Schema with the same identifier already exists");
        this.schemas.push(schema);
        return schema;
    }

    removeSchema(identifier: string): boolean {
        let schema = this.getSchema(identifier);
        if (schema == null) return false;
        this.schemas.splice(this.schemas.indexOf(schema), 1);
        return true;
    }

}