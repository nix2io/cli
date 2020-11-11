/*
 * File: user.ts
 * Created: 10/12/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { User } from '@nix2/service-core';
import config from './config';

const userObj = <
    {
        email: string;
        name: string;
    }
>config.get('user');

export const authed = userObj != null;
export const user = module.exports.authed
    ? new User(userObj.email, userObj.name)
    : null;
