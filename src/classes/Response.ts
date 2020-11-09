/*
 * File: Response.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { HTTP_STATUS_CODES } from '../constants';
import { ResponseType } from '../types';
type statusClasses =
    | 'server_error'
    | 'client_error'
    | 'redirection'
    | 'success'
    | 'informational';

/**
 * Class to represent an api response for a method.
 * @class Response
 */
export default class Response {
    public codeInfo: {
        label: string;
        description: string;
    };

    /**
     * Constructor for an API response.
     * @param {string} code         The HTTP status code of the response.
     * @param {string} description  A description of the response.
     * @param {string} returnType   The return type of the response.
     * @param {string} errorMessage The message to display on an error.
     */
    constructor(
        public code: string,
        public description: string | null,
        public returnType: string | null,
        public errorMessage: string | null,
    ) {
        if (errorMessage != null && errorMessage != errorMessage.toUpperCase())
            throw new Error(`Invalid error message "${errorMessage}"`);
        if (Object.keys(HTTP_STATUS_CODES).indexOf(code) == -1)
            throw new Error(`${code} is an invalid status code`);
        this.codeInfo = Object.values(HTTP_STATUS_CODES)[
            Object.keys(HTTP_STATUS_CODES).indexOf(code)
        ];
    }

    /**
     * Deserialize an object into an `Method` instance.
     * @function deserialize
     * @static
     * @memberof Response
     * @param    {string}       code HTTP status code.
     * @param    {ResponseType} data Javascript object of the `Method`.
     * @returns  {Response}          `Response` instance.
     */
    static deserialize(code: string, data: ResponseType): Response {
        // Test if the values are present
        const vals = ['description', 'returnType', 'errorMessage'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        // test the datatypes
        if (typeof data.description != 'string' && data.description != null)
            throw Error(`description: ${data.description} is not a string`);

        if (typeof data.returnType != 'string' && data.returnType != null)
            throw Error(`returnType: ${data.returnType} is not a string`);

        if (typeof data.errorMessage != 'string' && data.errorMessage != null)
            throw Error(`errorMessage: ${data.errorMessage} is not a string`);

        return new Response(
            code,
            data.description || null,
            data.returnType || null,
            data.errorMessage || null,
        );
    }

    /**
     * The response successfull code.
     * @function isOK
     * @memberof Response
     * @returns  {boolean} `true` if the response is a successful code.
     */
    get isOK(): boolean {
        return this.isStatusClass('success');
    }

    /**
     * The response an error code.
     * @function isError
     * @memberof Response
     * @returns  {boolean} `true` if the response is an error code.
     */
    get isError(): boolean {
        return (
            this.isStatusClass('client_error') ||
            this.isStatusClass('server_error')
        );
    }

    /**
     * Serialize a Response instance into an object.
     * @function serialize
     * @memberof Response
     * @returns  {ResponseType} Response type shape.
     */
    serialize(): ResponseType {
        return {
            description: this.description,
            returnType: this.returnType,
            errorMessage: this.errorMessage,
        };
    }

    /**
     * Returns the class based off the status code.
     * @function getStatusClass
     * @memberof Response
     * @returns  {string} Class of the status code.
     */
    getStatusClass(): statusClasses {
        const code = parseInt(this.code);
        if (code >= 500) return 'server_error';
        if (code >= 400) return 'client_error';
        if (code >= 300) return 'redirection';
        if (code >= 200) return 'success';
        if (code >= 100) return 'informational';
        throw new Error(`${code} is an invalid status code`);
    }

    /**
     * Compaires a given status class to the Response's status class.
     * @function isStatusClass
     * @memberof Response
     * @param   {string} _class String of the response class to check.
     * @returns {boolean}       `true` if the given class is what the response class is.
     */
    isStatusClass(_class: statusClasses): boolean {
        return this.getStatusClass() == _class;
    }
}
