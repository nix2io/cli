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
import yaml = require('js-yaml');

// check if the file exists
const serviceFileExists = (serviceFilePath: string): boolean => {
    try {
        return fs.existsSync(serviceFilePath);
    } catch (err) {
        throw new Error(ERRORS.NO_CHECK_FOR_FILE);
    }
};

// get the file from the path
const getServiceFile = (serviceFilePath: string): string => {
    try {
        return fs.readFileSync(serviceFilePath, 'utf-8');
    } catch (err) {
        throw new Error(ERRORS.NO_OPEN_FILE);
    }
};

// returns a js object from the yaml
const getServiceObject = (content: string): Record<string, unknown> => {
    try {
        // parse the file's yaml
        const serviceObject = yaml.load(content);
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

// parse the object into a ServiceContext instance
// TODO: change any to a "shape of" thing that describes the service context shape
const parseServiceObject = (
    serviceFilePath: string,
    serviceObject: Record<string, unknown>,
): serviceTypes => {
    // TODO: figure out a better way to do this
    let serviceClass: serviceTypeClasses;
    switch (serviceObject.type) {
        case 'api':
            serviceClass = services.APIServiceContext;
            break;
        case 'gateway':
            serviceClass = services.GatewayServiceContext;
            break;
        default:
            throw new Error(
                `Service type ${serviceObject.type} is unsupported`,
            );
    }
    return serviceClass.deserialize(
        serviceFilePath,
        <Record<string, any>>serviceObject,
    );
};
/**
 * Return the service object in the users current directory
 * @return {ServiceContext} Instance of the Service Context
 */
export const getServiceContext = (): serviceTypes | null => {
    // get the full file path
    const serviceFilePath = path.join(process.cwd(), SERVICE_FILE_NAME);
    // return null if there is no file
    if (!serviceFileExists(serviceFilePath)) return null;
    // get the file
    const content = getServiceFile(serviceFilePath);
    // get the service object
    const obj = getServiceObject(content);
    // parse and return the service context
    return parseServiceObject(serviceFilePath, obj);
};
