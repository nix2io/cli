/*
 * File: index.ts
 * Created: 10/26/2020 13:27:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ParseError } from '../shared/errors';
import lexer from './lexer';

export default (command: string): [null, null] | [null, ParseError] => {
    const [tokens, error] = lexer(command);
    console.log(tokens);

    if (error) {
        return [null, error];
    }
    return [null, null];
};
