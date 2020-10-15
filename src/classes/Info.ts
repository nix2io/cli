/*
 * File: Info.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import Author from './Author';


export default class Info {
    
    constructor(
        public identifier: string,
        public label: string|null,
        public description: string|null,
        public version: string|null,
        public authors: Author[],
        private createdTimestamp: number,
        private modifiedTimestamp: number,
        public license: string,
        public termsOfServiceURL: string
    ) {}

    get created() {
        return new Date(this.createdTimestamp * 1000);
    }

    get modified() {
        return new Date(this.modifiedTimestamp * 1000);
    }

    static deserialize(data: {[key: string]: any}) {
        return new Info(
            data.identifier,
            data.label || null,
            data.description || null,
            data.version,
            Object.values(data.authors).map((auth: any) => Author.deserialize(auth)),
            data.created,
            data.modified,
            data.license || null,
            data.termsOfServiceURL || null
        )
    }

    serialize() {
        return {
            identifier:        this.identifier,
            label:             this.label,
            description:       this.description,
            version:           this.version,
            authors:           this.authors.map(a => a.serialize()),
            created:           this.createdTimestamp,
            modified:          this.modifiedTimestamp,
            license:           this.license,
            termsOfServiceURL: this.termsOfServiceURL
        }
    }

    getAuthorsByFlags(...flags: string[]): Author[] {
        return this.authors.filter(author => flags.every(flag => author.inherited_flags.has(flag)));
    }

    getContributers() {
        return this.getAuthorsByFlags('contributer');
    }

    getDevs() {
        return this.getAuthorsByFlags('dev');
    }

    getLeadDevs() {
        return this.getAuthorsByFlags('leadDev');
    }

    getAuthor(email: string): Author|null {
        let match = this.authors.filter(a => a.email == email);
        if (match.length == 0) return null;
        return match[0];
    }

    createAndAddAuthor(email: string, name: string, publicEmail: string, url: string, alert: string, flags: Set<string>): Author {
        return this.addAuthor(new Author(email, name, publicEmail, url, alert, flags)); 
    }

    addAuthor(author: Author): Author {
        // throw an error if an author w the same email
        if (this.getAuthor(author.email) != null) throw new Error("An author with the same email exists");
        this.authors.push(author);
        return author;
    }

    removeAuthor(email: string) {
        let author = this.getAuthor(email);
        if (author == null) return false;
        this.authors.splice(this.authors.indexOf(author), 1);
        return true;
    }
}