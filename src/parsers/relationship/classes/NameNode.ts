/*
 * File: NameNode.ts
 * Created: 10/26/2020 20:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
import { CommandContext, RelationshipNode } from '.';

export default class RelationshipNameNode implements RelationshipNode {
    constructor(public token: Token) {}

    run(context: CommandContext): string[] {
        const value = this.token.value;
        if (value == null) throw Error('value of token is null');
        context.schemas.add(value);
        return [value];
    }
}
