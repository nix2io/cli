/*
 * File: NameNode.ts
 * Created: 10/26/2020 20:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
import { CommandContext, RelationshipNode } from '.';

/**
 * Class for representing a Relationship name node.
 * @class RelationshipNameNode
 */
export default class RelationshipNameNode implements RelationshipNode {
    /**
     * Constructor for a relationship name node.
     * @param {Token} token Token will the name value.
     */
    constructor(public token: Token) {}

    /**
     * Runs the node.
     *
     * Adds the name to the context.
     * @function run
     * @memberof RelationshipNameNode
     * @param {CommandContext} context Root command context.
     * @returns {string[]} List with the name value.
     */
    run(context: CommandContext): string[] {
        const value = this.token.value;
        if (value == null) throw Error('value of token is null');
        context.schemas.add(value);
        return [value];
    }
}
