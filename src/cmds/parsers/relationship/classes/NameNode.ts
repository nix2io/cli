/*
 * File: NameNode.ts
 * Created: 10/26/2020 20:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommandContext, Node, Token } from ".";

export default class NameNode implements Node {
    constructor(
        public token: Token
    ) { }
    
    run(context: CommandContext): string[] {
        let value = this.token.value!;
        context.schemas.add(value);
        return [value];
    }
}