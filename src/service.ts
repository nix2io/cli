/*
 * File: service.ts
 * Created: 10/08/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { SERVICE_FILE_NAME, ERRORS } from './constants';
import * as services from './classes/services';
import fs = require('fs');
import path = require('path');
import YAWN from './yawn';
import ServiceFile from './classes/ServiceFile';
import commander = require('commander');
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
 * Returns a Javascript object from the service.yaml
 * @param   {string} content Content of the file
 * @returns {object}       service object
 */
const getServiceObject = (content: string): YAWN => {
    try {
        // parse the file's yaml
        const serviceObject = new YAWN(content);
        // throw an error if the response is anything but an object
        if (typeof serviceObject != 'object')
            throw new Error(ERRORS.INVALID_YAML);
        return serviceObject;
    } catch (err) {
        throw new Error(ERRORS.INVALID_YAML);
    }
};

type serviceTypeClasses =
    | typeof services.APIServiceContext
    | typeof services.GatewayServiceContext;

type serviceTypes = services.APIServiceContext | services.GatewayServiceContext;

/**
 * Parse a Javascript object to return a `ServiceContext` instance
 * @param   {string} serviceFilePath Path to the `service.yaml`
 * @param   {object} serviceObject   Javascript object of the service object
 * @returns {ServiceContext}         new `ServiceContext` instance
 */
export const parseServiceObject = (
    serviceFile: ServiceFile,
    serviceObject: Record<string, unknown>,
): serviceTypes => {
    let serviceClass: serviceTypeClasses;
    switch (serviceObject.type) {
        case 'api':
            serviceClass = services.APIServiceContext;
            break;
        default:
            throw new Error(
                `Service type ${serviceObject.type} is unsupported`,
            );
    }
    return serviceClass.deserialize(serviceFile, <any>serviceObject);
};

/**
 * Return the service object in the users current directory
 * @return {ServiceContext} Instance of the Service Context
 */
export const getServiceContext = (
    options: any,
    overwriteDir: string | undefined = undefined,
): serviceTypes | null => {
    // get the full file path

    const serviceFilePath = getServiceContextFilePath(options, overwriteDir);

    // return null if there is no file
    if (!serviceFileExists(serviceFilePath)) return null;
    // get the file
    const serviceFile = getServiceFile(serviceFilePath);
    // parse and return the service context
    return parseServiceObject(serviceFile, serviceFile.getJSON());
};
