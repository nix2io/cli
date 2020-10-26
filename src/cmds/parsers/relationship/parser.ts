/*
 * File: parser.ts
 * Created: 10/26/2020 19:45:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { BinaryOperationNode, ParseResult, Token } from "./classes";
import NameNode from "./classes/NameNode";
import { SYMBOL_COMMA, SYMBOL_LINK, SYMBOL_RPAR, TOKEN_COMMA, TOKEN_EOC, TOKEN_LINK, TOKEN_LPAR, TOKEN_NAME, TOKEN_RPAR } from "./constants";
import { InvalidSyntaxError } from "./errors";

export default (tokens: Token[]) => {
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
    }

    const binaryOperation = (): ParseResult => {
        const result = new ParseResult();
        let left = result.register(name()!);
        if (result.error != null) { return result; }

        while (currentToken?.type == TOKEN_COMMA || currentToken?.type == TOKEN_LINK) {
            const binaryOperationToken = currentToken;
            result.register(advance()!);
            const right = result.register(name());
            if (result.error != null) { return result; }
            left = new BinaryOperationNode(left, binaryOperationToken, right);
        }
        return result.success(left);
    }

    const name = (): ParseResult => {
        const result = new ParseResult();
        const token = currentToken!;
        if (token.type == TOKEN_NAME) {
            result.register(advance()!);
            return result.success(new NameNode(token));
        } else if (token.type == TOKEN_LPAR) {
            result.register(advance()!);
            const binaryOperationResult = result.register(binaryOperation());
            if (result.error != null) { return result; }
            if (currentToken?.type == TOKEN_RPAR) {
                result.register(advance()!);
                return result.success(binaryOperationResult);
            } else {
                return result.failure(new InvalidSyntaxError(currentToken!.positionStart!, currentToken!.positionEnd!, `expected ${SYMBOL_RPAR}`));
            }
        } else {
            return result.failure(new InvalidSyntaxError(currentToken!.positionStart!, currentToken!.positionEnd!, "expected schema name"));
        }
    }
    // advance to the first token
    advance();
    // get the result as a bin op
    let result = binaryOperation();
    if (result.error == null && currentToken!.type != TOKEN_EOC) {
        return result.failure(new InvalidSyntaxError(
            currentToken!.positionStart!,
            currentToken!.positionEnd!,
            `expected ${SYMBOL_COMMA} or ${SYMBOL_LINK}`
        ));
    }
    return result;
}