/*
 * File: service.ts
 * Created: 10/08/2020 10:24:57
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import {
    ExecutionContext,
    Obj,
    Service,
    ServiceCore,
} from '@nix2/service-core';

import { PLUGIN_PATH } from './constants';
import { getServiceFilePath } from './util';
import { user } from './user';

export const serviceCore = new ServiceCore({
    pluginsDirectory: PLUGIN_PATH,
});

/**
 * Return the service object in the users current directory.
 * @param {Obj} options Options from Commander.js.
 * @param {string | undefined} overwriteDir Dir to be overwritten from CLI flag.
 * @returns {ServiceContext} Instance of the Service Context.
 */
export const getService = (
    options: Obj,
    overwriteDir: string | undefined = undefined,
): Service | null => {
    if (user == null) {
        // TODO: prompt user to log in with `getUser`
        throw Error('not authorized');
    }
    // TODO: environmetns in the env context
    const executionContext = new ExecutionContext(
        getServiceFilePath(options, overwriteDir),
        user,
    );
    return serviceCore.getService(executionContext);
};

export const services = serviceCore.serviceTypes;
