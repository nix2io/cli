/*
 * File: lexer.ts
 * Created: 10/26/2020 18:52:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../shared/classes';
import {
    SYMBOL_COMMA,
    SYMBOL_LINK,
    SYMBOL_LPAR,
    SYMBOL_RPAR,
    TOKEN_COMMA,
    TOKEN_EOC,
    TOKEN_LINK,
    TOKEN_LPAR,
    TOKEN_NAME,
    TOKEN_RPAR,
} from './constants';
import { IllegalCharacterError } from '../shared/errors';

export default (command: string): [Token[], IllegalCharacterError | null] => {
    // position of the command
    let position = -1;
    // current character of the command
    let currentCharacter: string | null = null;

    /**
     * Test a string for a valid schema id.
     *
     * TODO: make it the identifier regex.
     * @param {string} str String to test.
     * @returns {boolean} True if the string is a letter, false if not.
     */
    const isLetter = (str: string | null): boolean =>
        str != null && /^[a-zA-Z]$/.test(str);

    /**
     * Advance the lexer position and char.
     * @returns {void}
     */
    const advance = (): void => {
        position++;
        currentCharacter = position < command.length ? command[position] : null;
        // console.log('advance called');
        // console.log('new pos : ' + position);
        // console.log('new cha : ' + currentCharacter);
    };

    /**
     * Make a Schema ID token.
     * @returns {Token} New ID Token.
     */
    const makeName = (): Token => {
        const positionStart = position;
        let name = '';
        while (currentCharacter != null && isLetter(currentCharacter)) {
            name += currentCharacter;
            advance();
        }
        return new Token(TOKEN_NAME, name, positionStart, position);
    };
    // advance to the first char
    advance();

    // create the tokens list
    const tokens: Token[] = [];
    // advance through the command till the char is null
    while (currentCharacter != null) {
        // ignore spaces
        if (currentCharacter == ' ') {
            advance();
        }
        // build a schema ID token
        else if (isLetter(currentCharacter)) {
            tokens.push(makeName());
        }
        // link token
        else if (currentCharacter == SYMBOL_LINK) {
            tokens.push(new Token(TOKEN_LINK, null, position));
            advance();
        } else if (currentCharacter == SYMBOL_COMMA) {
            tokens.push(new Token(TOKEN_COMMA, null, position));
            advance();
        } else if (currentCharacter == SYMBOL_LPAR) {
            tokens.push(new Token(TOKEN_LPAR, null, position));
            advance();
        } else if (currentCharacter == SYMBOL_RPAR) {
            tokens.push(new Token(TOKEN_RPAR, null, position));
            advance();
        } else {
            const positionStart = position;
            const invalidCharacter = currentCharacter;
            advance();
            return [
                [],
                new IllegalCharacterError(
                    positionStart,
                    position,
                    `'${invalidCharacter}'`,
                ),
            ];
        }
    }
    tokens.push(new Token(TOKEN_EOC, null, position));
    return [tokens, null];
};
