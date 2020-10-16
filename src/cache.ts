/*
 * File: cache.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CACHE_PATH } from './constants';
import fs = require('fs');
import path = require('path');

class Cache {
    makePath(name: string): string {
        return path.join(CACHE_PATH, name);
    }

    exists(name: string) {
        return fs.existsSync(this.makePath(name));
    }

    get(name: string): { [key: string]: any } {
        if (!this.exists(name)) return {};
        try {
            return JSON.parse(fs.readFileSync(this.makePath(name), 'utf-8'));
        } catch (err) {
            console.error('Could not read the cache');
            return {};
        }
    }

    set(name: string, obj: { [key: string]: any }) {
        // TODO: add error handling
        fs.writeFileSync(this.makePath(name), JSON.stringify(obj));
    }

    clear() {
        fs.readdirSync(CACHE_PATH).forEach((file: string, _: any) => {
            const filePath = path.join(CACHE_PATH, file);
            if (!fs.lstatSync(filePath).isDirectory()) fs.unlinkSync(filePath);
        });
    }
}

export default new Cache();
