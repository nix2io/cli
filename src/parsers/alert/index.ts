/*
 * File: index.ts
 * Created: 10/26/2020 13:27:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ParseError } from '../shared/errors';
import lexer from './lexer';
import parser from './parser';
import { AlertRule } from './classes';

export default (command: string): [AlertRule, null] | [null, ParseError] => {
    const [tokens, error] = lexer(command);
    if (error) {
        return [null, error];
    }
    const ast = parser(tokens);
    if (ast.error != null) return [null, ast.error];
    // console.log(JSON.stringify(ast, null, 2));
    const rule = new AlertRule('');
    ast.node!.run(rule);
    return [rule, null];
};
