/*
 * File: Database.ts
 * Created: 11/04/2020 12:31:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export default class Database {
    constructor(
        public id: string,
        public name: string,
        public environments: Set<string> = new Set(),
    ) {}
}
