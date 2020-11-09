/*
 * File: CommandContext.ts
 * Created: 10/25/2020 19:58:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

/**
 * Class for representing a linked Schema.
 */
class LinkedSchemas {
    public schemas: { [key: string]: Set<string> } = {};

    /**
     * Add a schema and its parent to the schemas.
     * @function add
     * @memberof LinkedSchemas
     * @param {string} schema Schema name.
     * @param {string} parent Parent name.
     * @returns {void}
     */
    add(schema: string, parent: string): void {
        if (Object.keys(this.schemas).indexOf(schema) == -1) {
            this.schemas[schema] = new Set();
        }
        this.schemas[schema].add(parent);
    }

    /**
     * Test if the schema has a parent.
     * @param   {string} identifier Identifier of the parent.
     * @returns {boolean}           `true` if the schema has the parent, `false` if not.
     */
    hasParents(identifier: string): boolean {
        return Object.keys(this.schemas).indexOf(identifier) != -1;
    }

    /**
     * Return the parents for a schema.
     * @param   {string} identifier Schema identifier.
     * @returns {Set<string>}       Set of parents.
     */
    getParents(identifier: string): Set<string> {
        return this.schemas[identifier];
    }
}
/**
 * Class for representing a command context.
 * @class CommandContext
 */
export default class CommandContext {
    public linked = new LinkedSchemas();
    public schemas: Set<string> = new Set();
}
