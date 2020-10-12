import { CONFIG_FILE_PATH } from './constants';
const fs = require('fs');

// TODO: add error handling
class Config {
    private config: {[key: string]: any};

    constructor() {
        this.config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));
    }

    write() {
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(this.config))
    }

    has(name: string): boolean {
        return Object.keys(this.config).indexOf(name) != -1;
    }

    get(name: string): any {
        if (!this.has(name)) return null;
        return this.config[name];
    }

    set(name: string, value: any) {
        this.config[name] = value;
        this.write();
    }
}


export default new Config();