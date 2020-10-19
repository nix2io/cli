/*
 * File: Info.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import Author from './Author';

export default class Info {
    /**
     * Class to represent info for a service
     * @class Info
     * @param {string}        identifier        Service identifier *see spec for format*
     * @param {string}        label             service label
     * @param {string}        description       description of the service
     * @param {string}        version           version
     * @param {array<Author>} authors           list of Authors
     * @param {number}        createdTimestamp  timestamp of service creation
     * @param {number}        modifiedTimestamp timestamp of service last modified
     * @param {string}        license           spdx license expression
     * @param {string}        termsOfServiceURL url for terms of service
     */
    constructor(
        public identifier: string,
        public label: string | null,
        public description: string | null,
        public version: string | null,
        public authors: Author[],
        private createdTimestamp: number,
        private modifiedTimestamp: number,
        public license: string | null,
        public termsOfServiceURL: string | null,
    ) {}

    /**
     * Date object from the created timestamp
     * @memberof Info
     * @returns {Data} Date object
     */
    get created(): Date {
        return new Date(this.createdTimestamp * 1000);
    }

    /**
     * Date object from the modified timestamp
     * @memberof Info
     * @returns {Data} Date object
     */
    get modified(): Date {
        return new Date(this.modifiedTimestamp * 1000);
    }

    /**
     * Deserialize an object into an `Info` instance
     * @function deserialize
     * @static
     * @memberof Info
     * @param    {object} data Javascript object of the Info
     * @returns  {Info}        `Info` instance
     */
    static deserialize(data: Record<string, unknown>): Info {
        // validate the given data
        if (typeof data.identifier != 'string')
            throw Error(`identifier: ${data.identifier} is not a string`);
        if (typeof data.label != 'undefined' && typeof data.label != 'string')
            throw Error(`label: ${data.label} is not a string`);
        if (
            typeof data.description != 'undefined' &&
            typeof data.description != 'string'
        )
            throw Error(`description: ${data.description} is not a string`);
        if (typeof data.version != 'string')
            throw Error(`version: ${data.version} is not a string`);
        if (typeof data.authors != 'undefined' || !Array.isArray(data.authors))
            throw Error(`authors: ${data.authors} is not an array`);
        if (typeof data.created != 'number')
            throw Error(`created: ${data.created} is not an int`);
        if (typeof data.modified != 'number')
            throw Error(`modified: ${data.modified} is not an int`);
        if (
            typeof data.license != 'undefined' &&
            typeof data.license != 'string'
        )
            throw Error(`license: ${data.license} is not a string`);
        if (
            typeof data.termsOfServiceURL != 'undefined' &&
            typeof data.termsOfServiceURL != 'string'
        )
            throw Error(
                `termsOfServiceURL: ${data.termsOfServiceURL} is not a string`,
            );

        return new Info(
            data.identifier,
            data.label || null,
            data.description || null,
            data.version,
            Object.values(data.authors).map((auth) =>
                Author.deserialize(<Record<string, unknown>>auth),
            ),
            data.created,
            data.modified,
            data.license || null,
            data.termsOfServiceURL || null,
        );
    }

    /**
     * Serialize an Author instance into an object
     * @function serialize
     * @memberof Author
     * @returns  {Record<string, unknown>} Javascript object
     */
    serialize(): Record<string, unknown> {
        return {
            identifier: this.identifier,
            label: this.label,
            description: this.description,
            version: this.version,
            authors: this.authors.map((a) => a.serialize()),
            created: this.createdTimestamp,
            modified: this.modifiedTimestamp,
            license: this.license,
            termsOfServiceURL: this.termsOfServiceURL,
        };
    }

    /**
     * Returns a list of authors if they have all given flags
     * @function getAuthorsByFlags
     * @memberof Info
     * @param   {Array<string>} flags list of flags
     * @returns {Array<Author>}       results of authors with the given flags
     */
    getAuthorsByFlags(...flags: string[]): Author[] {
        return this.authors.filter((author) =>
            flags.every((flag) => author.inherited_flags.has(flag)),
        );
    }

    /**
     * Returns a list of authors with the `contributer` flag
     * @function getContributers
     * @memberof Info
     * @returns {Array<Author>} results of authors with the `contributer` flag
     */
    getContributers(): Author[] {
        return this.getAuthorsByFlags('contributer');
    }

    /**
     * Returns a list of authors with the `dev` flag
     * @function getDevs
     * @memberof Info
     * @returns {Array<Author>} results of authors with the `dev` flag
     */
    getDevs(): Author[] {
        return this.getAuthorsByFlags('dev');
    }

    /**
     * Returns a list of authors with the `leadDev` flag
     * @function getLeadDevs
     * @memberof Info
     * @returns {Array<Author>} results of authors with the `leadDev` flag
     */
    getLeadDevs(): Author[] {
        return this.getAuthorsByFlags('leadDev');
    }

    /**
     * Returns an author with a given email address
     * @function getAuthor
     * @memberof Info
     * @param   {string} email Authors email address
     * @returns {Author}       results of authors with the `leadDev` flag
     */
    getAuthor(email: string): Author | null {
        const match = this.authors.filter((a) => a.email == email);
        if (match.length == 0) return null;
        return match[0];
    }

    /**
     * Create and add an author to the service info
     * @function createAndAddAuthor
     * @memberof Info
     * @param   {string}      email        Email of the author (used as an identifier)
     * @param   {string}      name         Full name of the author
     * @param   {string}      publicEmail  Email to display for public use
     * @param   {string}      url          URL of the author
     * @param   {string}      alert        String for alert options
     * @param   {Set<string>} flags        Set of flags for the author
     * @returns {Author}                   Created author
     */
    createAndAddAuthor(
        email: string,
        name: string | null,
        publicEmail: string | null,
        url: string | null,
        alert: string,
        flags: Set<string>,
    ): Author {
        return this.addAuthor(
            new Author(email, name, publicEmail, url, alert, flags),
        );
    }

    /**
     * Add an author to the service info
     * @function addAuthor
     * @memberof Info
     * @param   {Author} author Author object to be added
     * @returns {Author}        Same author given
     */
    addAuthor(author: Author): Author {
        // throw an error if an author w the same email
        if (this.getAuthor(author.email) != null)
            throw new Error('An author with the same email exists');
        this.authors.push(author);
        return author;
    }

    /**
     * Remove an author with a given email address
     * @function removeAuthor
     * @memberof Info
     * @param   {string} email Author's email address
     * @returns {boolean}      `true` if successfully removed
     */
    removeAuthor(email: string): boolean {
        const author = this.getAuthor(email);
        if (author == null) return false;
        this.authors.splice(this.authors.indexOf(author), 1);
        return true;
    }
}
