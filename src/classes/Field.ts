/*
 * File: Field.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export default class Field {
    constructor(
        public name: string,
        public label: string|null,
        public description: string|null,
        public type: string,
        public required: boolean,
        public defaultValue: any,
        public flags: Set<string>
    ) {
        // if (this.required && defaultValue == null) throw new Error("a required field can't have a default value of null");
    }

    static deserialize(name: string, data: {[key: string]: any}) {
        // check some cases
        // TODO: move this to the Field        
        if (typeof data.type == "undefined") throw new Error("type not given in field");
    
        return new Field(
            name,
            data.label || null,
            data.description || null,
            data.type,
            data.required,
            data.default,
            new Set(data.flags)
        )
    }

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