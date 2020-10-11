import Author from './Author';


export default class Info {
    constructor(
        public identifier: string,
        public label: string,
        public description: string,
        public version: string,
        public authors: Author[],
        public license: string,
        public termsOfServiceURL: string
    ) {}

    getAuthorsByFlags(...flags: string[]): Author[] {
        return this.authors.filter(author => flags.every(flag => author.flags.has(flag)));
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
}