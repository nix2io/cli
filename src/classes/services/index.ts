/*
 * File: index.ts
 * Created: 10/15/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
// this is the ugliest shit ever holy fuck

// Typescript
import TypescriptServiceContext from './TypescriptServiceContext';
export { TypescriptServiceContext };
// GraphQL
import GraphQLServiceContext from './GraphQLServiceContext';
export { GraphQLServiceContext };
// Python
import PythonServiceContext from './PythonServiceContext';
export { PythonServiceContext };

// add any new types to here

// valid types
export type VALID_SERVICE_TYPE_INSTANCES =
    | TypescriptServiceContext
    | GraphQLServiceContext
    | PythonServiceContext;
export type VALID_SERVICE_TYPES =
    | typeof TypescriptServiceContext
    | typeof GraphQLServiceContext
    | typeof PythonServiceContext;

const VALID_SERVICES = [GraphQLServiceContext, PythonServiceContext];

// create a new hash table for the service types and their classes
export const SERVICE_TYPE_MAP = Object.assign(
    {},
    ...VALID_SERVICES.map((service) => ({
        [service.NAME]: service,
    })),
);
