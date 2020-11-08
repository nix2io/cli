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

/**
 * Get a list of the available environments
 * @function getAvailableEnvironments
 * @returns {string[]} list of environments
 */
export const getAvailableEnvironments = (): string[] => {
    return Object.values(ENVIRONMENTS);
};

/**
 * Read the current environment name from config
 * @function readCurrentEnvironmentName
 * @returns {string} current environment name
 */
export const readCurrentEnvironmentName = (): string => {
    let env = config.get(ENVIRONMENT_CONFIG_NAME);
    if (env == null) env = writeCurrentEnvironmentName(DEFAULT_ENVIRONMENT);
    if (typeof env != 'string') throw Error(ERRORS.ENV_VAL_NOT_STRING);
    return env;
};

/**
 * Writes an environment name to the current config
 * @param   {string} environmentName name of the new environment
 * @returns {string} environment name
 */
export const writeCurrentEnvironmentName = (
    environmentName: string,
): string => {
    // verify valid env
    if (getAvailableEnvironments().indexOf(environmentName) == -1)
        throw Error('INVALID_ENV');
    config.set(ENVIRONMENT_CONFIG_NAME, environmentName);
    return environmentName;
};
