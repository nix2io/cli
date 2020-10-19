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

    get(name: string): Record<string, unknown> {
        if (!this.exists(name)) return {};
        try {
            return JSON.parse(fs.readFileSync(this.makePath(name), 'utf-8'));
        } catch (err) {
            console.error('Could not read the cache');
            return {};
        }
    }

    /**
     * Set the value of
     * @function set
     * @memberof Cache
     * @param name name of the cache
     * @param obj  object value
     */
    set(name: string, obj: Record<string, unknown>) {
        fs.writeFileSync(this.makePath(name), JSON.stringify(obj));
    }

    /**
     * Remove all the files
     * @function clear
     * @memberof Cache
     * @returns  `True` if successfull
     */
    clear() {
        fs.readdirSync(CACHE_PATH).forEach((file: string, _: unknown) => {
            const filePath = path.join(CACHE_PATH, file);
            if (!fs.lstatSync(filePath).isDirectory()) fs.unlinkSync(filePath);
        });
    }
}

export default new Cache();
