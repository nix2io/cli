/*
 * File: service.ts
 * Created: 10/08/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ERRORS } from './constants';
import {
    VALID_SERVICE_TYPE_INSTANCES,
    SERVICE_TYPE_MAP,
    VALID_SERVICE_TYPES,
} from './classes';
import fs = require('fs');
import { getRootOptions, getServiceContextFilePath } from './util';
import { Obj, ServiceContextType } from './types';
import { safeLoad } from 'js-yaml';

/**
 *
 * @param serviceFilePath
 */
const serviceFileExists = (serviceFilePath: string): boolean => {
    try {
        return fs.existsSync(serviceFilePath);
    } catch (err) {
        throw new Error(ERRORS.NO_CHECK_FOR_FILE);
    }
};

/**
 * Return the content from a service file.
 * @param   {string} serviceFilePath Path to the file.
 * @returns {string}                 File contents.
 */
const getServiceFileContent = (serviceFilePath: string): string => {
    try {
        return fs.readFileSync(serviceFilePath, 'utf-8');
    } catch (err) {
        throw new Error(ERRORS.NO_OPEN_FILE);
    }
};

/**
 * Return the class from a service context type.
 * @param   {string}    type Type of the service context.
 * @returns {ServiceContext} Class of a service context.
 */
export const getServiceClassFromType = (type: string): VALID_SERVICE_TYPES => {
    // check if the type is valid
    const typeIndex = Object.keys(SERVICE_TYPE_MAP).indexOf(type);
    if (typeIndex == -1) {
        throw new Error(`Service type '${type}' is unsupported`);
    }
    // return the deserialized service context instance
    return <VALID_SERVICE_TYPES>(
        (<unknown>Object.values(SERVICE_TYPE_MAP)[typeIndex])
    );
};

/**
 * Parse a Javascript object to return a `ServiceContext` instance.
 * @param   {string} serviceFilePath Path to the `service.yaml`.
 * @param   {object} serviceObject   Javascript object of the service object.
 * @returns {ServiceContext}         New `ServiceContext` instance.
 */
export const parseServiceObject = (
    serviceFilePath: string,
    serviceObject: ServiceContextType,
): VALID_SERVICE_TYPE_INSTANCES => {
    return getServiceClassFromType(serviceObject.type).deserialize(
        serviceFilePath,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <any>serviceObject,
    );
};

/**
 * Return the service object in the users current directory.
 * @param {Obj} options Options from Commander.js.
 * @param {string | undefined} overwriteDir Dir to be overwritten from CLI flag.
 * @returns {ServiceContext} Instance of the Service Context.
 */
export const getServiceContext = (
    options: Obj,
    overwriteDir: string | undefined = undefined,
): VALID_SERVICE_TYPE_INSTANCES | null => {
    // get the full file path
    const serviceFilePath = getServiceContextFilePath(options, overwriteDir);
    // return null if there is no file
    if (!serviceFileExists(serviceFilePath)) return null;
    // get the file
    const serviceFileContent = getServiceFileContent(serviceFilePath);
    const serviceFileObject = <unknown>safeLoad(serviceFileContent);
    if (serviceFileObject == null || serviceFileObject == undefined)
        throw Error('INVALID YAML');
    // parse and return the service context
    const serviceContext = parseServiceObject(
        serviceFilePath,
        <ServiceContextType>serviceFileObject,
    );
    const specifiedEnvironment = getRootOptions(options).env;
    if (typeof specifiedEnvironment != 'string' && specifiedEnvironment != null)
        throw Error('invalid environment');
    serviceContext.selectedEnvironmentName =
        specifiedEnvironment || serviceContext.selectedEnvironmentName;
    return serviceContext;
};
