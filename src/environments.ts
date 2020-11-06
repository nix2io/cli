/*
 * File: environments.ts
 * Created: 11/06/2020 14:30:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import config from './config';
import { ENVIRONMENTS, DEFAULT_ENVIRONMENT, ERRORS } from './constants';

const ENVIRONMENT_CONFIG_NAME = 'selected-environment';

export const getAvailableEnvironments = (): string[] => {
    return Object.values(ENVIRONMENTS);
};

export const getEnvironment = (): string => {
    let env = config.get(ENVIRONMENT_CONFIG_NAME);
    if (env == null) env = setEnvironment(DEFAULT_ENVIRONMENT);
    if (typeof env != 'string') throw Error(ERRORS.ENV_VAL_NOT_STRING);
    return env;
};

export const setEnvironment = (environmentName: string): string => {
    // verify valid env
    if (getAvailableEnvironments().indexOf(environmentName) == -1)
        throw Error('INVALID_ENV');
    config.set(ENVIRONMENT_CONFIG_NAME, environmentName);
    return environmentName;
};
