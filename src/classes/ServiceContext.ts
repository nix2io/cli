import Info from './Info';
const yaml = require('js-yaml');
const fs   = require('fs');


export default class ServiceContext {
    constructor(
        private filePath: string,
        public  info:     Info,
        public  type:     String
    ) {};

    serialize() {
        return {
            info: this.info.serialize(),
            type: this.type
        }
    }

    write() {
        let s = this.serialize();
        let content = yaml.safeDump(s);
        fs.writeFileSync(this.filePath, content);
        return true;
    }

}