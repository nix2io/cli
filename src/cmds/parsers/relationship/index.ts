/*
 * File: index.ts
 * Created: 10/26/2020 18:52:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommandContext } from './classes';
import { RelationshipParseError } from './errors';
import lexer from './lexer';
import parser from './parser';


export default (command: string): [CommandContext, null] | [null, RelationshipParseError] => {
    const [tokens, error] = lexer(command);
    if (error) { return [null, error]; }
    const ast = parser(tokens);
    if (ast.error != null) return [null, ast.error];
    const ctx = new CommandContext();
    ast.node!.run(ctx)
    return [ctx, null];
}