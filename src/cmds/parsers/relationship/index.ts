/*
 * File: index.ts
 * Created: 10/26/2020 18:52:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommandContext } from './classes';
import lexer from './lexer';
import parser from './parser';


export default (command: string) => {
    const tokens = lexer(command);
    const ast = parser(tokens);
    if (ast.error != null) return ast;
    return ast.node!.run(new CommandContext())
}