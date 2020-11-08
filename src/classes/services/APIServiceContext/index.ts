/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { TypescriptServiceContext } from '..';
import { Info, Schema, Path } from '../..';
import { APIServiceContextType } from '../../../types';

export default class APIServiceContext extends TypescriptServiceContext {
    static NAME = 'api';

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
        serviceFilePath: string,
        info: Info,
        schemas: Schema[],
        paths: { [key: string]: Path },
    ) {
        super(serviceFilePath, info, 'api', schemas);
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
        data: APIServiceContextType,
    ): APIServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas', 'paths'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new APIServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) =>
                Schema.deserialize(schema),
            ),
            Object.assign(
                {},
                ...Object.keys(data.paths).map((k) => ({
                    [k]: Path.deserialize(k, data.paths[k]),
                })),
            ),
        );
    }

    static createObject(
        data: {
            identifier: string;
            label: string;
            description: string;
            userLeadDev: boolean;
        },
        user: any,
    ): APIServiceContextType {
        return {
            ...super.makeObject(data, user),
            ...{
                paths: {},
            },
        };
    }

    /**
     * Serialize a `APIServiceContext` instance into an object
     * @function serialize
     * @memberof APIServiceContext
     * @returns  {APIServiceContextType} Javascript object
     */
    serialize(): APIServiceContextType {
        return {
            ...super.serialize(),
            ...{
                type: 'api',
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
