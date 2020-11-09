/*
 * File: errors.ts
 * Created: 10/26/2020 18:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

/**
 * Class for representing Parser Error.
 * @class ParseError
 */
export class ParseError extends Error {
    /**
     * Contructor for the ParseError.
     * @param {number} positionStart Starting position of the parse error.
     * @param {number} positionEnd   Ending position of the parse error.
     * @param {string} errorName     Name of the error.
     * @param {string} details       Error details.
     */
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public errorName: string,
        public details: string,
    ) {
        super();
    }
}
/**
 * Class for representing an illegal character error.
 * @class IllegalCharacterError
 */
export class IllegalCharacterError extends ParseError {
    /**
     * Constructor for an `IllegalCharacterError`.
     * @param {number} positionStart Starting position of the parse error.
     * @param {number} positionEnd   Ending position of the parse error.
     * @param {string} details       Details for an illegal character.
     */
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public details: string,
    ) {
        super(positionStart, positionEnd, 'Illegal Character', details);
    }
}

/**
 * Class for representing an invalid syntax error.
 * @class InvalidSyntaxError
 */
export class InvalidSyntaxError extends ParseError {
    /**
     * Constructor for `InvalidSyntaxError`.
     * @param {number} positionStart Starting position of the parse error.
     * @param {number} positionEnd   Ending position of the parse error.
     * @param {string} details       Details for the invalid syntax.
     */
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public details: string = '',
    ) {
        super(positionStart, positionEnd, 'Invalid Syntax', details);
    }
}
