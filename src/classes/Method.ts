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
        public description: string,
        private _responses: { [key: string]: Response },
    ) {}

    /**
     * Deserialize an object into an `Method` instance
     * @function deserialize
     * @memberof Method
     * @param    {object} data Javascript object of the Method
     * @returns  {Method}      `Method` instance
     */
    static deserialize(type: string, data: Record<string, unknown>): Method {
        return new Method(
            type,
            data.label,
            data.description,
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
     * @returns  {Record<string, unknown>} Javascript object
     */
    serialize(): Record<string, unknown> {
        return {
            label: this.label,
            description: this.description,
            responses: Object.assign(
                {},
                ...Object.keys(this.responses).map((k: string) => ({
                    [k]: this.responses[k].serialize(),
                })),
            ),
        };
    }
}
