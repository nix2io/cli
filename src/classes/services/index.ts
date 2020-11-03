/*
 * File: index.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import APIServiceContext from './APIServiceContext';
import GatewayServiceContext from './GatewayServiceContext';
import TypescriptServiceContext from './TypescriptServiceContext';

export type VALID_SERVICE_TYPE_INSTANCES =
    | APIServiceContext
    | GatewayServiceContext;
export type VALID_SERVICE_TYPES =
    | typeof APIServiceContext
    | typeof GatewayServiceContext;

export const SERVICE_TYPE_MAP = {
    api: APIServiceContext,
};

export { APIServiceContext, GatewayServiceContext, TypescriptServiceContext };
