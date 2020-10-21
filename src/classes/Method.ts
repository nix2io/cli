/*
 * File: Method.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { Response } from '.';
import { MethodType } from '../types';

export default class Method {
    private internalServerError = new Response(
        '500',
        'Internal Server Error',
        null,
        'INTERNAL',
    );
    /**
     * Class to represent a `method` for a `path` for an `API`
     * @class Method
     * @param {string}          type        method type
     * @param {string}          label       label of the method
     * @param {string}          description description of the method
     * @param {array<Response>} _responses  responces for the method
     */
    constructor(
        public type: string,
        public label: string,
        public description: string | null,
        private _responses: { [key: string]: Response },
    ) {}

    /**
     * Deserialize an object into an `Method` instance
     * @function deserialize
     * @static
     * @memberof Method
     * @param    {object} data Javascript object of the Method
     * @returns  {Method}      `Method` instance
     */
    static deserialize(type: string, data: MethodType): Method {
        // test the datatypes
        /**
        type responsesType = Record<string, Record<string, unknown>>;
        let responses: responsesType;
        if (typeof data.label != 'string')
            throw Error(`label: ${data.label} is not a string`);
        if (
            typeof data.description != 'undefined' &&
            typeof data.description != 'string'
        )
            throw Error(`description: ${data.description} is not a string`);
        if (typeof data.responses != 'object' && data.responses != null) {
            throw Error(`responses: ${data.responses} is not an object`);
        } else {
            responses = <responsesType>data.responses;
        }*/
        // create the new method
        return new Method(
            type,
            data.label,
            data.description || null,
            Object.assign(
                {},
                ...Object.keys(data.responses).map((k) => ({
                    [k]: Response.deserialize(k, data.responses[k]),
                })),
            ),
        );
    }

    /**
     * Returns the given responses plus the default responces
     *
     * Default responces:
     * - 500: Internal Server Error
     *
     * @function responces
     * @memberof Method
     * @returns  {Record<string, Response>} object of all the responces
     */
    get responses(): Record<string, Response> {
        return {
            ...this._responses,
            ...{
                '500': this.internalServerError,
            },
        };
    }

    /**
     * Serialize an Method instance into an object
     * @function serialize
     * @memberof Method
     * @returns  {MethodType} Javascript object
     */
    serialize(): MethodType {
        return {
            label: this.label,
            description: this.description,
            responses: Object.assign(
                {},
                ...Object.keys(this._responses).map((k: string) => ({
                    [k]: this._responses[k].serialize(),
                })),
            ),
        };
    }
}
