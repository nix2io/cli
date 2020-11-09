/*
 * File: config.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CONFIG_FILE_PATH } from './constants';
import fs = require('fs');

/**
 * Class for managing config.
 * @class Config
 */
class Config {
    private config: Record<string, unknown>;

    /**
     * Constructor for config.
     */
    constructor() {
        this.config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'));
    }

    /**
     * Write the current config to disk.
     * @function write
     * @memberof Config
     * @returns {void}
     */
    write(): void {
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(this.config));
    }

    /**
     * Test if a config key is set.
     * @function has
     * @memberof Config
     * @param   {string} name Name of the config key.
     * @returns {boolean}     `true` if the config key exists.
     */
    has(name: string): boolean {
        return Object.keys(this.config).indexOf(name) != -1;
    }

    /**
     * Get the value for a config key.
     * @function get
     * @memberof Config
     * @param   {string} name Name of the config variable.
     * @returns {unknown}     The value from config.
     */
    get(name: string): unknown {
        if (!this.has(name)) return null;
        return this.config[name];
    }

    /**
     * Set the value of a config key.
     * @function set
     * @memberof Config
     * @param {string} name  Name of the config key.
     * @param {any}    value Value that was set.
     */
    set(name: string, value: unknown) {
        this.config[name] = value;
        this.write();
    }
}

export default new Config();
