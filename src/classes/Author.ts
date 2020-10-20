/*
 * File: Author.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { AuthorType } from '../types'
const flagInheritence = {
    dev: 'contributer',
    leadDev: 'dev',
};

export default class Author {
    /**
     * Class to represent the a service Author
     * @class Author
     * @param {string}      email        Email of the author (used as an identifier)
     * @param {string}      name         Full name of the author
     * @param {string}      publicEmail  Email to display for public use
     * @param {string}      url          URL of the author
     * @param {string}      alert        String for alert options
     * @param {Set<string>} flags        Set of flags for the author
     */
    public inherited_flags: Set<string>;

    constructor(
        public email: string,
        public name: string | null,
        public publicEmail: string | null,
        public url: string | null,
        public alert: string,
        public flags: Set<string>,
    ) {
        this.inherited_flags;
        this.updateFlags();
    }

    /**
     * Deserialize an object into an `Author` instance
     * @function deserialize
     * @static
     * @memberof Author
     * @param   data Javascript object of the Author
     * @returns      `Author` instance
     */
    static deserialize(data: AuthorType): Author {
        // Test if the values are present
        const vals = ['email', 'name', 'publicEmail', 'url', 'alert', 'flags'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + " not given");
        }
        
        // Test the given data
        if (typeof data.email != 'string')
            throw Error(`email: ${data.email} is not a string`);
        if (typeof data.name != 'string')
            throw Error(`name: ${data.name} must be a string`);
        if (typeof data.publicEmail != 'string' && data.publicEmail != null)
            throw Error(`publicEmail: ${data.publicEmail} is not a string`);
        if (typeof data.url != 'string' && data.url != null)
            throw Error(`url: ${data.url} is not a string`);
        if (typeof data.alert != 'string' && data.alert != null)
            throw Error(`alert: ${data.alert} is not a string`);
        if (!Array.isArray(data.flags))
            throw Error(`flags: ${data.flags} is not a valid array`);

        return new Author(
            data.email,
            data.name || null,
            data.publicEmail || null,
            data.url || null,
            data.alert || 'none',
            new Set(data.flags),
        );
    }

    /**
     * Serialize an Author instance into an object
     * @function serialize
     * @memberof Author
     * @returns  {Record<string, unknown>} Javascript object
     */
    serialize(): AuthorType {
        return {
            email: this.email,
            name: this.name,
            publicEmail: this.publicEmail,
            url: this.url,
            alert: this.alert,
            flags: Array.from(this.flags),
        };
    }

    /**
     * Convert the given flags into flags that include all the inherited flags
     * @function updateFlags
     * @private
     * @memberof Author
     * @returns  {void}
     */
    private updateFlags(): void {
        const flags = new Set(this.flags);
        for (const flag of flags) {
            let currentFlag = flag;
            while (Object.keys(flagInheritence).indexOf(currentFlag) != -1) {
                currentFlag = Object.values(flagInheritence)[Object.keys(flagInheritence).indexOf(currentFlag)];
                flags.add(currentFlag);
            }
        }
        this.inherited_flags = flags;
    }
}
