/*
 * File: cli.ts
 * Created: 11/04/2020 12:25:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import inquirer = require('inquirer');
import config from '../config';
import { SYMBOLS } from '../constants';
import * as colors from 'colors';
import * as fauna from 'faunadb';

/**
 * Get the Fauna access token from the user.
 * @returns {Promise<string>} Promise of the user provided acces token.
 */
export const getFaunaAccessToken = async (): Promise<string> => {
    console.log(
        `\nYou have to add your FaunaDB key\n${colors.underline(
            'https://app.fauna.com/keys',
        )}\n`,
    );
    const token = await inquirer
        .prompt([
            {
                name: 'token',
                message: 'Admin Key',
                type: 'password',
                mask: '*',
            },
        ])
        .catch((err) => {
            console.error(err);
        });
    return token.token;
};

const FAUNA_TOKEN_NAME = 'fauna-token';

/**
 * Save a token to the config.
 * @param {string} secret FaunaDB access key.
 * @returns {Promise<boolean>} True if save success.
 */
export const saveFaunaAccessToken = async (
    secret: string,
): Promise<boolean> => {
    const { Get, Databases } = fauna.query;
    return await new fauna.Client({ secret })
        .query(Get(Databases()))
        .then(() => {
            config.set(FAUNA_TOKEN_NAME, secret);
            console.log(colors.green(`${SYMBOLS.CHECK} Key Saved`));
            return true;
        })
        .catch((err) => {
            if (err.name == 'Unauthorized') {
                console.error(colors.red('Invalid token'));
            }
            return false;
        });
};

/**
 * Prompt the user for Fauna authentication.
 * @returns {Promise<boolean>} True if save success.
 */
export const promptUserAuthentication = async (): Promise<boolean> => {
    const token = await getFaunaAccessToken();
    return await saveFaunaAccessToken(token);
};

/**
 * Prompts the user for Fauna authentication if token is not in config.
 * @returns {Promise<boolean>} True if authenticated.
 */
export const requireDBAuthentication = async (): Promise<boolean> => {
    if (config.get(FAUNA_TOKEN_NAME) == null)
        return await promptUserAuthentication();
    return true;
};

/**
 * Gets the Fauna client.
 * @returns {Promise<Client>} Promise Fauna Client or null if it could not get it.
 */
export const getClient = async (): Promise<fauna.Client | null> => {
    if (!(await requireDBAuthentication())) {
        return null;
    }
    const token = config.get(FAUNA_TOKEN_NAME);
    return new fauna.Client({ secret: <string>token });
};
