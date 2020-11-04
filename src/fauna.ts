/*
 * File: fauna.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import inquirer = require('inquirer');
import config from './config';
import * as fauna from 'faunadb';
import { SYMBOLS } from './constants';
import * as colors from 'colors';

const FAUNA_TOKEN_NAME = 'fauna-token';

export const getFaunaAccessToken = async (): Promise<string> => {
    console.log(
        `\nYou have to add your FaunaDB key\n${colors.underline(
            'https://app.fauna.com/keys',
        )}\n`,
    );
    return inquirer
        .prompt([
            {
                name: 'token',
                message: 'Admin Key',
                type: 'password',
                mask: '*',
            },
        ])
        .then((data) => {
            return data.token;
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Save a token to the config
 * @param key FaunaDB access key
 */
export const saveFaunaAccessToken = async (secret: string) => {
    const { Get, Databases } = fauna.query;
    new fauna.Client({ secret })
        .query(Get(Databases()))
        .then(() => {
            config.set(FAUNA_TOKEN_NAME, secret);
            console.log(colors.green(`${SYMBOLS.CHECK} Key Saved`));
        })
        .catch((err) => {
            if (err.name == 'Unauthorized') {
                console.error(colors.red('Invalid token'));
            }
        });
};

export const promptUserAuthentication = async () => {
    const token = await getFaunaAccessToken();
    await saveFaunaAccessToken(token);
};

export const requireDBAuthentication = async () => {
    if (config.get(FAUNA_TOKEN_NAME) == null) await promptUserAuthentication();
};

export const getClient = async () => {
    await requireDBAuthentication();
    const token = config.get(FAUNA_TOKEN_NAME);
    return new fauna.Client({ secret: <string>token });
};

export interface FaunaDBQueryResponse<T> {
    ref: {
        id: string;
    };
    data: T;
    ts: number;
}
