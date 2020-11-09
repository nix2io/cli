/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { TypescriptServiceContext } from '..';
import { Info, Schema, Path, User } from '../..';
import {
    APIServiceContextType,
    SchemaType,
    MakeObjectType,
} from '../../../types';

/**
 * Class for representing an API Service Context.
 * @class APIServiceContext
 */
export default class APIServiceContext extends TypescriptServiceContext {
    static NAME = 'api';

    public paths: { [key: string]: Path };

    /**
     * Constructer for an API Service context.
     * @param {string}               serviceFilePath Path to the service.yaml.
     * @param {Info}                 info            Info of the service.
     * @param {Array<Schema>}        schemas         List of service schemas.
     * @param {Record<string, Path>} paths           Object of paths for the API.
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
     * Deserialize an object into an `APIServiceContext` instance.
     * @function deserialize
     * @static
     * @memberof APIServiceContext
     * @param   {string} serviceFilePath Path to the service.yaml.
     * @param   {object} data            Javascript object of the Info.
     * @returns {APIServiceContext}      Service context object.
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
            Object.values(data.schemas).map((schema: SchemaType) =>
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

    /**
     * Make a `APIServiceContext` object.
     * @param {MakeObjectType} data Data for the `ServiceContext` object.
     * @param {User}           user User instance.
     * @returns {APIServiceContextType} New `APIServiceContext` object.
     */
    static createObject(
        data: MakeObjectType,
        user: User,
    ): APIServiceContextType {
        return {
            ...super.makeObject(data, user),
            ...{
                paths: {},
            },
        };
    }

    /**
     * Serialize a `APIServiceContext` instance into an object.
     * @function serialize
     * @memberof APIServiceContext
     * @returns  {APIServiceContextType} Javascript object.
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
