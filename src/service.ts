/*
 * File: service.ts
 * Created: 10/08/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ERRORS } from './constants';
import { VALID_SERVICE_TYPE_INSTANCES, SERVICE_TYPE_MAP } from './classes';
import fs = require('fs');
import YAWN from './yawn';
import ServiceFile from './classes/ServiceFile';
import { getServiceContextFilePath } from './util';

// check if the file exists
const serviceFileExists = (serviceFilePath: string): boolean => {
    try {
        return fs.existsSync(serviceFilePath);
    } catch (err) {
        throw new Error(ERRORS.NO_CHECK_FOR_FILE);
    }
};

// get the file contents from the path
const getServiceFileContent = (serviceFilePath: string): string => {
    try {
        return fs.readFileSync(serviceFilePath, 'utf-8');
    } catch (err) {
        throw new Error(ERRORS.NO_OPEN_FILE);
    }
};

/**
 * Returns a ServiceFile object from a path
 * @param serviceFilePath Path to the service object
 */
const getServiceFile = (serviceFilePath: string): ServiceFile => {
    const fileContent = getServiceFileContent(serviceFilePath);
    const YAWNObject = new YAWN(fileContent);
    return new ServiceFile(serviceFilePath, YAWNObject);
};

/**
 * Parse a Javascript object to return a `ServiceContext` instance
 * @param   {string} serviceFilePath Path to the `service.yaml`
 * @param   {object} serviceObject   Javascript object of the service object
 * @returns {ServiceContext}         new `ServiceContext` instance
 */
export const parseServiceObject = (
    serviceFile: ServiceFile,
    serviceObject: Record<string, any>,
): VALID_SERVICE_TYPE_INSTANCES => {
    // check if the type is valid
    const typeIndex = Object.keys(SERVICE_TYPE_MAP).indexOf(serviceObject.type);
    if (typeIndex == -1) {
        throw new Error(`Service type ${serviceObject.type} is unsupported`);
    }
    // return the deserialized service context instance
    return Object.values(SERVICE_TYPE_MAP)[typeIndex].deserialize(
        serviceFile,
        <any>serviceObject,
    );
};

/**
 * Return the service object in the users current directory
 * @return {ServiceContext} Instance of the Service Context
 */
export const getServiceContext = (
    options: any,
    overwriteDir: string | undefined = undefined,
): VALID_SERVICE_TYPE_INSTANCES | null => {
    // get the full file path

    const serviceFilePath = getServiceContextFilePath(options, overwriteDir);

    // return null if there is no file
    if (!serviceFileExists(serviceFilePath)) return null;
    // get the file
    const serviceFile = getServiceFile(serviceFilePath);
    // parse and return the service context
    return parseServiceObject(serviceFile, serviceFile.getJSON());
};
