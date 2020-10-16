/*
 * File: Path.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Method } from '.';

type methods = "get" | "post" | "head" | "delete" | "put" | "patch" | "options";


export default class Path {
    constructor(
        public path: string,
        public methods: { [key in methods]: Method }
    ) { }

    static deserialize(path: string, methods: { [key: string]: any }): Path {
        return new Path(
            path,
            Object.assign({}, ...Object.keys(methods).map(k => ({ [k]: Method.deserialize(k, methods[k]) })))
        );
    }

    serialize(): { [key: string]: any } {
        // @ts-ignore  WHAT THE HELL
        return Object.assign({}, ...Object.keys(this.methods).map((k: string) => ({ [k]: this.methods[k].serialize() })))
    }
}