/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Info, Schema, ServiceContext } from '../..';
import { ServiceContextType } from '../../../types';
import ServiceFile from '../../ServiceFile';

export default class GatewayServiceContext extends ServiceContext {
    static NAME = 'gateway';

    constructor(serviceFile: ServiceFile, info: Info, schemas: Schema[]) {
        super(serviceFile, info, 'gateway', schemas);
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
        serviceFile: ServiceFile,
        data: ServiceContextType,
    ): GatewayServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas', 'paths'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new GatewayServiceContext(
            serviceFile,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) =>
                Schema.deserialize(schema),
            ),
        );
    }
}
