/*
 * File: Field.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { FieldType } from '../types';

export default class Field {
    /**
     * Class to represent the a service Schema
     * @class Field
     * @param {string}      name         field name
     * @param {string}      label        field label (human format)
     * @param {string}      description  field description
     * @param {string}      type         datatype of the field
     * @param {boolean}     required     `true` if the field is required
     * @param {any}         defaultValue default value of the field
     * @param {Set<string>} flags        field flags
     */
    constructor(
        public name: string,
        public label: string | null,
        public description: string | null,
        public type: string,
        public required: boolean,
        public defaultValue: unknown,
        public flags: Set<string>,
    ) {}

    /**
     * Deserialize an object into an `Field` instance
     * @function deserialize
     * @static
     * @memberof Field
     * @param    {string}                  name     Name of the field
     * @param    {Record<string, unknown>} data     Javascript object of the Field
     * @returns  {Field}                           `Field` instance
     */
    static deserialize(name: string, data: FieldType): Field {
        // Test if the values are present
        const vals = [
            'label',
            'description',
            'type',
            'required',
            'default',
            'flags',
        ];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        // check the given data
        if (typeof data.label != 'undefined' && typeof data.label != 'string')
            throw Error(`label: ${data.label} is not a string`);
        if (
            typeof data.description != 'undefined' &&
            typeof data.description != 'string'
        )
            throw Error(`description: ${data.description} is not a string`);
        if (typeof data.type != 'string')
            throw Error(`type: ${data.type} is not a string`);
        if (typeof data.required != 'boolean')
            throw Error(`required: ${data.required} is not a boolean`);
        if (typeof data.flags != 'undefined' && !Array.isArray(data.flags))
            throw Error(`flags: ${data.flags} is not a valid array`);

        return new Field(
            name,
            data.label || null,
            data.description || null,
            data.type,
            data.required,
            data.default,
            new Set(data.flags),
        );
    }

    /**
     * Serialize an Field instance into an object
     * @function serialize
     * @memberof Field
     * @returns  {Record<string, unknown>} Javascript object
     */
    serialize(): FieldType {
        return {
            label: this.label,
            description: this.description,
            type: this.type,
            required: this.required,
            default: this.defaultValue,
            flags: Array.from(this.flags),
        };
    }
}
