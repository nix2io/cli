/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Info, Schema, ServiceContext } from '../..';
import { SchemaType, ServiceContextType } from '../../../types';

export default class GatewayServiceContext extends ServiceContext {
    static NAME = 'gateway';

    constructor(serviceFilePath: string, info: Info, schemas: Schema[]) {
        super(serviceFilePath, info, 'gateway', schemas);
    }

    /**
     * Deserialize an object into an `GatewayServiceContext` instance
     * @function deserialize
     * @static
     * @memberof GatewayServiceContext
     * @param   {string} serviceFilePath path to the service.yaml
     * @param   {object} data            Javascript object of the Info
     * @returns {GatewayServiceContext}      Service context object
     */
    static deserialize(
        serviceFilePath: string,
        data: ServiceContextType,
    ): GatewayServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas', 'paths'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new GatewayServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: SchemaType) =>
                Schema.deserialize(schema),
            ),
        );
    }
}
