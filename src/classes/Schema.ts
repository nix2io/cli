import Field from "./Field";


export default class Schema {
    constructor(
        public identifier:  string,
        public label:       string,
        public description: string,
        public pluralName:  string,
        public fields:      { [id: string]: Field }
    ) {}

    serialize() {
        return {
            identifier:  this.identifier,
            label:       this.label,
            description: this.description,
            // This just runs the .serialize() method over the fields object
            fields:      Object.assign({}, ...Object.keys(this.fields).map(k => ({[k]: this.fields[k].serialize()})))
        }
    }
}