/*
 * File: Token.ts
 * Created: 10/26/2020 19:06:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export default class Token {
    constructor(
        public type: string,
        public value: string | null = null,
        public positionStart: number | null = null,
        public positionEnd: number | null = null)
    {
        if (this.positionStart != null) {
            this.positionEnd = this.positionStart + 1;
        }
    }
}