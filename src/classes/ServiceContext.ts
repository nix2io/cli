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

}