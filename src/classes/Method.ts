export default class Method {
    constructor(
        public type:  string,
        public label: string,
        public description: string
    ) {}

    static deserialize(type: string, data: {[key: string]: any}) {
        return new Method(
            type,
            data.label,
            data.description
        );
    }

    serialize() {
        return {
            label: this.label,
            description: this.description
        }
    }
}