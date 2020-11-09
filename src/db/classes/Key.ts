/*
 * File: Database.ts
 * Created: 11/07/2020 12:00:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

/**
 * Class to represent a database key.
 * @class Key
 */
export default class Key {
    /**
     * Constructor for a database `Key`.
     * @param {string} name The key name.
     * @param {string} key  The key value.
     */
    constructor(public name: string, public key: string) {}
}
