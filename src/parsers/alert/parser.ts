/*
 * File: parser.ts
 * Created: 10/26/2020 19:45:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../shared/classes';
import { InvalidSyntaxError } from '../shared/errors';
import {
    TOKEN_EOC,
    SYMBOL_RPAR,
    TOKEN_RPAR,
    TOKEN_NAME,
    TOKEN_LPAR,
    TOKEN_COMMA,
    TOKEN_INDEX,
    TOKEN_EXCLUDE,
} from './constants';
import {
    AlertParseResult,
    NameNode,
    BinaryOperationNode,
    UnaryOperationNode,
    AlertNode,
} from './classes';

export default (tokens: Token[]): AlertParseResult => {
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

    const binaryOperation = (): AlertParseResult => {
        const result = new AlertParseResult();
        let left = result.register(name());
        if (result.error != null) {
            return result;
        }

        while (
            currentToken?.type == TOKEN_COMMA ||
            currentToken?.type == TOKEN_INDEX
        ) {
            const binaryOperationToken = currentToken;
            result.register(<Token>advance());
            const right = result.register(name());
            if (result.error != null) {
                return result;
            }
            if (!(left instanceof AlertNode)) throw 'left not alert node';
            if (!(right instanceof AlertNode)) throw 'right not alert node';
            left = new BinaryOperationNode(left, binaryOperationToken, right);
        }
        return result.success(left);
    };

    const name = (): AlertParseResult => {
        const result = new AlertParseResult();
        const token = currentToken;
        if (token == null) throw Error('token is null');

        if (token.type == TOKEN_EXCLUDE) {
            result.register(<Token>advance());
            const factor = result.register(name());
            if (result.error != null) {
                return result;
            }
            if (!(factor instanceof AlertNode))
                throw 'factor is not alert node';
            return result.success(new UnaryOperationNode(token, factor));
        } else if (token.type == TOKEN_NAME) {
            result.register(<Token>advance());
            return result.success(new NameNode(token));
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentToken = currentToken!;
    if (result.error == null && currentToken.type != TOKEN_EOC) {
        return result.failure(
            new InvalidSyntaxError(
                <number>currentToken?.positionStart,
                <number>currentToken?.positionEnd,
                `expected `,
            ),
        );
    }
    return result;
};
