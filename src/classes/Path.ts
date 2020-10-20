/*
 * File: Path.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Method } from '.';
import { MethodType, PathType } from '../types';

type methods = 'get' | 'post' | 'head' | 'delete' | 'put' | 'patch' | 'options';

export default class Path {
    /**
     * Class to represent a Path for an API
     * @param {string}                 path    a string of the path
     * @param {Record<string, Method>} methods An object of HTTP methods
     */
    constructor(
        public path: string,
        public methods: { [key in methods]: Method },
    ) {}

    /**
     * Deserialize an object into an `Info` instance
     * @function deserialize
     * @static
     * @memberof Path
     * @param    {object} data Javascript object of the Path
     * @returns  {Path}        `Path` instance
     */
    static deserialize(
        path: string,
        methods: {[key: string]: MethodType},
    ): Path {
        return new Path(
            path,
            Object.assign(
                {},
                ...Object.keys(methods).map((k) => ({
                    [k]: Method.deserialize(k, methods[k]),
                })),
            ),
        );
    }

    /**
     * Serialize a Path instance into an object
     * @function serialize
     * @memberof Path
     * @returns  {PathType} Javascript object
     */
    serialize(): PathType {
        return Object.assign(
            {},
            ...Object.keys(this.methods).map((k: string) => ({
                [k]: Object.values(this.methods)[Object.keys(this.methods).indexOf(k)].serialize(),
            })),
        );
    }
}
