/*
 * File: Token.ts
 * Created: 10/26/2020 19:06:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

/**
 * Class for representing a Token.
 */
export default class Token {
    /**
     * Constructor for a Token.
     * @param {string}        type          Token type.
     * @param {string | null} value         Token value.
     * @param {number | null} positionStart Token starting position.
     * @param {number | null} positionEnd   Token ending position.
     */
    constructor(
        public type: string,
        public value: string | null = null,
        public positionStart: number | null = null,
        public positionEnd: number | null = null,
    ) {
        if (this.positionStart != null) {
            this.positionEnd = this.positionStart + 1;
        }
    }
}
