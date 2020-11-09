/*
 * File: Schema.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import Field from './Field';
import { titleCase } from '../util';
import { SchemaType } from '../types';

/**
 * Class to represent the a service Schema.
 * @class Schema
 */
export default class Schema {
    private id: Field;

    /**
     * Constructor for a `Schema`.
     * @param {string} identifier  Schema identifier (see docs for format).
     * @param {string} label       Label of the schema.
     * @param {string} description Description of the schema.
     * @param {string} pluralName  Plural name of the schema.
     * @param {object} _fields     Object of the fields.
     */
    constructor(
        public identifier: string,
        public label: string,
        public description: string | null,
        public pluralName: string,
        public _fields: { [id: string]: Field },
    ) {
        this.id = new Field(
            '_id',
            'ID',
            `Id of the ${label}`,
            'number',
            true,
            null,
            new Set(['pk']),
        );
    }

    /**
     * Deserialize an object into an `Schema` instance.
     * @function deserialize
     * @static
     * @memberof Schema
     * @param   {SchemaType} data Javascript object of the Schema.
     * @returns {Schema}          `Schema` instance.
     */
    static deserialize(data: SchemaType): Schema {
        // Test if the values are present
        const vals = ['identifier', 'label', 'description', 'fields'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        // test the types for the given data
        if (typeof data.identifier != 'string')
            throw Error(`identifier: ${data.identifier} is not a string`);
        if (typeof data.label != 'string')
            throw Error(`label: ${data.label} is not a string`);
        if (typeof data.description != 'string' && data.description != null)
            throw Error(`description: ${data.description} is not a string`);
        if (typeof data.pluralName != 'string')
            throw Error(`pluralName: ${data.pluralName} is not a string`);
        if (typeof data.fields != 'object' && data.fields != null) {
            throw Error(`fields: ${data.fields} is not an object`);
        }

        return new Schema(
            data.identifier,
            data.label,
            data.description || null,
            data.pluralName,
            Object.assign(
                {},
                ...Object.keys(data.fields).map((k) => ({
                    [k]: Field.deserialize(k, data.fields[k]),
                })),
            ),
        );
    }

    /**
     * Serialize an Schema instance into an object.
     * @function serialize
     * @memberof Schema
     * @returns {SchemaType} Javascript object.
     */
    serialize(): SchemaType {
        return {
            identifier: this.identifier,
            label: this.label,
            description: this.description,
            pluralName: this.pluralName,
            // This just runs the .serialize() method over the fields object
            fields: Object.assign(
                {},
                ...Object.keys(this._fields).map((k) => ({
                    [k]: this._fields[k].serialize(),
                })),
            ),
        };
    }

    /**
     * Get all fields including the identifier.
     * @function fields
     * @memberof Schema
     * @returns  {Record<string, Field>} Object of all fields.
     */
    get fields(): { [id: string]: Field } {
        return Object.assign(
            {
                [this.id.name]: this.id,
            },
            this._fields,
        );
    }

    /**
     * Returns the name of the schema in PascaleCase.
     * @function pascalCase
     * @memberof Schema
     * @returns {string} Formatted schema name.
     */
    get pascalCase(): string {
        return titleCase(this.label).replace(/ /g, '');
    }
}
