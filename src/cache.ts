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

/**
 * Class for managing CLI cache.
 * @class Cache
 */
class Cache {
    /**
     * Make the path of a cached file.
     * @function makePath
     * @memberof Cache
     * @private
     * @example
     * // make the path to authors cache
     * this.makePath('authors') // '/home/usr/.nix-cli/authors'
     * @param   {string} name Name of the cached file.
     * @returns {string}      The newly created path.
     */
    private makePath(name: string): string {
        return path.join(CACHE_PATH, name);
    }

    /**
     * Returns true if the cache file exists.
     * @function exists
     * @memberof Cache
     * @example
     * // something that exists
     * cache.exists('authors') // true
     * // something that doesn't
     * cache.exists('environments') // false
     * @param   {string} name Name of the cached file.
     * @returns {boolean}     `true` if the cached file exists.
     */
    exists(name: string): boolean {
        return fs.existsSync(this.makePath(name));
    }

    /**
     * Returns the contents of a cached file as an Object.
     * @function get
     * @memberof Cache
     * @example
     * // get the contents of the authors cache
     * cache.makePath('authors') // {authors: [...]}
     * @param   {name}               name Name of the cached file.
     * @returns {Record<string, unknown>} The returned object.
     */
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
     * Set the value of a cached file.
     * @function set
     * @memberof Cache
     * @param {string}                  name Name of the cached file.
     * @param {Record<string, unknown>} obj  Object value.
     * @returns {void}
     */
    set(name: string, obj: Record<string, unknown>): void {
        fs.writeFileSync(this.makePath(name), JSON.stringify(obj));
    }

    /**
     * Remove all the files.
     * @function clear
     * @memberof Cache
     * @returns  {void}
     */
    clear(): void {
        fs.readdirSync(CACHE_PATH).forEach((file: string, _: unknown) => {
            const filePath = path.join(CACHE_PATH, file);
            if (!fs.lstatSync(filePath).isDirectory()) fs.unlinkSync(filePath);
        });
    }
}

export default new Cache();
