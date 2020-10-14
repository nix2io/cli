export default class Field {
    constructor(
        public label: string,
        public description: string,
        public type: string,
        public required: boolean,
        public defaultValue: any,
        public flags: Set<string>
    ) {}

    serialize() {
        return {
            label: this.label,
            description: this.description,
            type: this.type,
            required: this.required,
            default: this.defaultValue,
            flags: Array.from(this.flags)
        }
    }
}