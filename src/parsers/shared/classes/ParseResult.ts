/*
 * File: ParseResult.ts
 * Created: 10/26/2020 19:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ParseError } from '../errors';
import { Node, Token } from '.';

/**
 * Class for representing a parse result.
 * @class ParseResult
 */
export default class ParseResult {
    /**
     * Constructor for the `ParseResult` class.
     * @param {ParseError | null} error Parse error if exists.
     * @param {Node | null}       node  Parse result node if exists.
     */
    constructor(
        public error: ParseError | null = null,
        public node: Node | null = null,
    ) {}

    /**
     * Register a result.
     * @function register
     * @memberof ParseResult
     * @param   {ParseResult | Token} result The result to register.
     * @returns {ParseResult | Node}         The given result or node.
     */
    register(result: ParseResult | Token): ParseResult | Node {
        if (result instanceof ParseResult) {
            if (result.error != null) {
                this.error = result.error;
            }
            if (result.node == null) throw Error('node is null');
            return result.node;
        }
        return result;
    }

    /**
     * A successful parse result.
     * @function success
     * @memberof ParseResult
     * @param   {Node}   node Node that was successful.
     * @returns {ParseResult} The parse result.
     */
    success(node: Node): this {
        this.node = node;
        return this;
    }

    /**
     * A failed parse result.
     * @param   {ParseError} error Parsing error.
     * @returns {ParseResult}      The parse result.
     */
    failure(error: ParseError): this {
        this.error = error;
        return this;
    }
}
