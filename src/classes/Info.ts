import Author from './Author';


export default class Info {
    
    constructor(
        public identifier: string,
        public label: string,
        public description: string,
        public version: string,
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

    serialize() {
        return {
            identifier:        this.identifier,
            label:             this.label,
            description:       this.description,
            version:           this.version,
            authors:           this.authors.map(a => a.serialize()),
            created:           this.createdTimestamp,
            modfiied:          this.modifiedTimestamp,
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

    addAuthor(email: string, name: string, publicEmail: string, url: string, alert: string, flags: Set<string>) {
        // throw an error if an author w the same email
        let a = this.getAuthor(email);
        if (a != null) throw new Error("An author with the same email exists");
        this.authors.push(new Author(email, name, publicEmail, url, alert, flags));
        return true;
    }

    removeAuthor(email: string) {
        let author = this.getAuthor(email);
        if (author == null) return false;
        this.authors.splice(this.authors.indexOf(author), 1);
        return true;
    }
}