/*
 * File: index.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
// TODO: redo this
// this is the ugliest shit ever holy fuck
import TypescriptServiceContext from './TypescriptServiceContext';
export { TypescriptServiceContext };
// api service
import APIServiceContext from './APIServiceContext';
export { APIServiceContext };
// gateway
import GatewayServiceContext from './GatewayServiceContext';
export { GatewayServiceContext };

// add any new types to here
// TODO: find a better way to do this

// valid types
export type VALID_SERVICE_TYPE_INSTANCES =
    | APIServiceContext
    | GatewayServiceContext;
export type VALID_SERVICE_TYPES =
    | typeof APIServiceContext
    | typeof GatewayServiceContext;

const VALID_SERVICES = [APIServiceContext, GatewayServiceContext];

export const SERVICE_TYPE_MAP = Object.assign(
    {},
    ...VALID_SERVICES.map((service) => ({
        [service.NAME]: service,
    })),
);

// [APIServiceContext.NAME]: APIServiceContext,
