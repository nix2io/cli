/*
 * File: Method.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { Response } from '.';


export default class Method {
    private internalServerError = new Response(
        '500',
        'Internal Server Error',
        null,
        'INTERNAL');
    
    constructor(
        public type:  string,
        public label: string,
        public description: string,
        private _responses: {[key: string]: Response}
    ) {
        
    }

    static deserialize(type: string, data: {[key: string]: any}) {
        return new Method(
            type,
            data.label,
            data.description,
            Object.assign({}, ...Object.keys(data.responses).map(k => ({[k]: Response.deserialize(k, data.responses[k])})))
        );
    }

    get responses(): {[key: string]: Response} {
        return {...this._responses, ...{
            '500': this.internalServerError
        }}
    }

    serialize() {
        return {
            label: this.label,
            description: this.description,
            responses: Object.assign({}, ...Object.keys(this.responses).map((k: string) => ({[k]: this.responses[k].serialize()})))
        }
    }
}