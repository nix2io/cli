/*
 * File: Schema.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import Field from './Field';
import { titleCase } from 'koontil';

export default class Schema {
    /**
     * Class to represent the a service Schema
     * @class Schema
     * @param {string} identifier  schema identifier (see docs for format)
     * @param {string} label       label of the schema
     * @param {string} description description of the schema
     * @param {string} pluralName  plural name of the schema
     * @param {object} _fields     dict of the fields
     */

    private id: Field;

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
     * Deserialize an object into an `Schema` instance
     * @function deserialize
     * @memberof Schema
     * @param   data Javascript object of the Schema
     * @returns      `Schema` instance
     */
    static deserialize(data: { [key: string]: unknown }): Schema {
        // test the types for the given data
        type fieldsType = Record<string, Record<string, unknown>>;
        let fields: fieldsType;
        if (typeof data.identifier != 'string')
            throw Error(`identifier: ${data.identifier} is not a string`);
        if (typeof data.label != 'string')
            throw Error(`label: ${data.label} is not a string`);
        if (
            typeof data.description != 'undefined' &&
            typeof data.description != 'string'
        )
            throw Error(`description: ${data.description} is not a string`);
        if (typeof data.pluralName != 'string')
            throw Error(`pluralName: ${data.pluralName} is not a string`);
        if (typeof data.fields != 'object' && data.fields != null) {
            throw Error(`fields: ${data.fields} is not an object`);
        } else {
            fields = <fieldsType>data.fields;
        }

        return new Schema(
            data.identifier,
            data.label,
            data.description || null,
            data.pluralName,
            Object.assign(
                {},
                ...Object.keys(fields).map((k) => ({
                    [k]: Field.deserialize(k, fields[k]),
                })),
            ),
        );
    }

    /**
     * Serialize an Schema instance into an object
     * @function serialize
     * @memberof Schema
     * @returns Javascript object
     */
    serialize(): { [key: string]: unknown } {
        return {
            identifier: this.identifier,
            label: this.label,
            description: this.description,
            // This just runs the .serialize() method over the fields object
            fields: Object.assign(
                {},
                ...Object.keys(this.fields).map((k) => ({
                    [k]: this.fields[k].serialize(),
                })),
            ),
        };
    }

    /**
     * Get all fields including the identifier
     * @function fields
     * @memberof Schema
     * @returns  {Record<string, Field>} Object of all fields
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
     * Returns the name of the schema in PascaleCase
     * @function pascalCase
     * @memberof Schema
     * @returns {string} Formatted schema name
     */
    get pascalCase(): string {
        return titleCase(this.label).replace(/ /g, '');
    }
}
