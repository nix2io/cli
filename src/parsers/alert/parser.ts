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
} from './classes';

export default (tokens: Token[]): AlertParseResult => {
    // current token index
    let position: number = -1;
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
        let left = result.register(name()!);
        if (result.error != null) {
            return result;
        }

        while (
            currentToken?.type == TOKEN_COMMA ||
            currentToken?.type == TOKEN_INDEX
        ) {
            const binaryOperationToken = currentToken;
            result.register(advance()!);
            const right = result.register(name());
            if (result.error != null) {
                return result;
            }
            left = new BinaryOperationNode(left, binaryOperationToken, right);
        }
        return result.success(left);
    };

    const name = (): AlertParseResult => {
        const result = new AlertParseResult();
        const token = currentToken!;

        if (token.type == TOKEN_EXCLUDE) {
            result.register(advance()!);
            let factor = result.register(name());
            if (result.error != null) {
                return result;
            }
            return result.success(new UnaryOperationNode(token, factor));
        } else if (token.type == TOKEN_NAME) {
            result.register(advance()!);
            return result.success(new NameNode(token));
        } else if (token.type == TOKEN_LPAR) {
            result.register(advance()!);
            const binaryOperationResult = result.register(binaryOperation());
            if (result.error != null) {
                return result;
            }
            if (currentToken?.type == TOKEN_RPAR) {
                result.register(advance()!);
                return result.success(binaryOperationResult);
            } else {
                return result.failure(
                    new InvalidSyntaxError(
                        currentToken!.positionStart!,
                        currentToken!.positionEnd!,
                        `expected ${SYMBOL_RPAR}`,
                    ),
                );
            }
        } else {
            return result.failure(
                new InvalidSyntaxError(
                    currentToken!.positionStart!,
                    currentToken!.positionEnd!,
                    'expected schema name',
                ),
            );
        }
    };

    // advance to the first token
    advance();
    // get the result as a bin op
    let result = binaryOperation();
    if (result.error == null && currentToken!.type != TOKEN_EOC) {
        return result.failure(
            new InvalidSyntaxError(
                currentToken!.positionStart!,
                currentToken!.positionEnd!,
                `expected `,
            ),
        );
    }
    return result;
};
