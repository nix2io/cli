/*
 * File: Method.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

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