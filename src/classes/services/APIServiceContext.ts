/*
 * File: APIServiceContext.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ServiceContext, Info } from '..';
import { Schema, Path } from '..';

type Obj = Record<string, unknown>;
type nestedObj = Record<string, Obj>;

export default class APIServiceContext extends ServiceContext {
    public paths: { [key: string]: Path };

    /**
     * Class to represent an API Service context
     * @class APIServiceContext
     * @param {string}               filePath path to the service.yaml
     * @param {Info}                 info     info of the service
     * @param {Array<Schema>}        schemas  list of service schemas
     * @param {Record<string, Path>} paths    object of paths for the API
     */
    constructor(
        filePath: string,
        info: Info,
        schemas: Schema[],
        paths: { [key: string]: Path },
    ) {
        super(filePath, info, 'api', schemas);
        this.paths = paths;
    }

    /**
     * Deserialize an object into an `APIServiceContext` instance
     * @function deserialize
     * @static
     * @memberof APIServiceContext
     * @param   {string} serviceFilePath path to the service.yaml
     * @param   {object} data            Javascript object of the Info
     * @returns {APIServiceContext}      Service context object
     */
    static deserialize(
        serviceFilePath: string,
        data: nestedObj,
    ): ServiceContext {
        return new APIServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) =>
                Schema.deserialize(schema),
            ),
            Object.assign(
                {},
                ...Object.keys(data.paths).map((k) => ({
                    [k]: Path.deserialize(k, <nestedObj>data.paths[k]),
                })),
            ),
        );
    }

    /**
     * Serialize a `APIServiceContext` instance into an object
     * @function serialize
     * @memberof APIServiceContext
     * @returns  {Record<string, unknown>} Javascript object
     */
    serialize(): Record<string, unknown> {
        return {
            ...super.serialize(),
            ...{
                paths: Object.assign(
                    {},
                    ...Object.keys(this.paths).map((k: string) => ({
                        [k]: this.paths[k].serialize(),
                    })),
                ),
            },
        };
    }
}
