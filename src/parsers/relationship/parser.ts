/*
 * File: parser.ts
 * Created: 10/26/2020 19:45:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../shared/classes';
import {
    BinaryOperationNode,
    RelationshipNode,
    RelationshipNameNode,
} from './classes';
import {
    SYMBOL_COMMA,
    SYMBOL_LINK,
    SYMBOL_RPAR,
    TOKEN_COMMA,
    TOKEN_EOC,
    TOKEN_LINK,
    TOKEN_LPAR,
    TOKEN_NAME,
    TOKEN_RPAR,
} from './constants';
import { InvalidSyntaxError } from '../shared/errors';
import RelationshipParseResult from './classes/RelationshipParseResult';

export default (tokens: Token[]): RelationshipParseResult => {
    // current token index
    let position = -1;
    // current token of the parser
    let currentToken: Token | null = null;

    const advance = (): Token | null => {
        position++;
        if (position < tokens.length) {
            currentToken = tokens[position];
        }
        return currentToken;
    };

    const binaryOperation = (): RelationshipParseResult => {
        const result = new RelationshipParseResult();
        let left = <RelationshipNode>result.register(name());
        if (result.error != null) {
            return result;
        }
        while (
            currentToken?.type == TOKEN_COMMA ||
            currentToken?.type == TOKEN_LINK
        ) {
            const binaryOperationToken = currentToken;
            const advanceResult = advance();
            if (advanceResult == null) throw 'advance is null';
            result.register(advanceResult);
            const right = <RelationshipNode>result.register(name());
            if (result.error != null) {
                return result;
            }
            left = new BinaryOperationNode(left, binaryOperationToken, right);
        }
        return result.success(left);
    };

    const name = (): RelationshipParseResult => {
        const result = new RelationshipParseResult();
        const token = <Token>currentToken;
        if (token.type == TOKEN_NAME) {
            result.register(<Token>advance());
            return result.success(new RelationshipNameNode(token));
        } else if (token.type == TOKEN_LPAR) {
            result.register(<Token>advance());
            const binaryOperationResult = result.register(binaryOperation());
            if (result.error != null) {
                return result;
            }
            if (currentToken?.type == TOKEN_RPAR) {
                result.register(<Token>advance());
                return result.success(binaryOperationResult);
            } else {
                return result.failure(
                    new InvalidSyntaxError(
                        <number>currentToken?.positionStart,
                        <number>currentToken?.positionEnd,
                        `expected ${SYMBOL_RPAR}`,
                    ),
                );
            }
        } else {
            return result.failure(
                new InvalidSyntaxError(
                    <number>currentToken?.positionStart,
                    <number>currentToken?.positionEnd,
                    'expected schema name',
                ),
            );
        }
    };
    // advance to the first token
    advance();
    // get the result as a bin op
    const result = binaryOperation();
    // TODO: fix this
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentToken = currentToken!;
    if (result.error == null && currentToken.type != TOKEN_EOC) {
        return result.failure(
            new InvalidSyntaxError(
                <number>currentToken?.positionStart,
                <number>currentToken?.positionEnd,
                `expected ${SYMBOL_COMMA} or ${SYMBOL_LINK}`,
            ),
        );
    }
    return result;
};
