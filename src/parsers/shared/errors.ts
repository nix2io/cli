/*
 * File: errors.ts
 * Created: 10/26/2020 18:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export class ParseError extends Error {
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public errorName: string,
        public details: string,
    ) {
        super();
    }
}

export class IllegalCharacterError extends ParseError {
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public details: string,
    ) {
        super(positionStart, positionEnd, 'Illegal Character', details);
    }
}

export class InvalidSyntaxError extends ParseError {
    constructor(
        public positionStart: number,
        public positionEnd: number,
        public details: string = '',
    ) {
        super(positionStart, positionEnd, 'Invalid Syntax', details);
    }
}
