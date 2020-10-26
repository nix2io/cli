/*
 * File: ParseResult.ts
 * Created: 10/26/2020 19:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ParseError } from '../errors';
import { Node, Token } from '.';

export default class ParseResult {
    constructor(
        public error: ParseError | null = null,
        public node: Node | null = null,
    ) {}

    register(result: ParseResult | Token): any {
        if (result instanceof ParseResult) {
            if (result.error != null) {
                this.error = result.error;
            }
            return result.node;
        }
        return result;
    }

    success(node: Node) {
        this.node = node;
        return this;
    }

    failure(error: ParseError) {
        this.error = error;
        return this;
    }
}
