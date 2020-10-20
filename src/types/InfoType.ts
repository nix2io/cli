/*
 * File: InfoType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */


import { AuthorType } from '.';

export default interface InfoType {
    identifier: string,
    label: string | null,
    description: string | null,
    version: string | null,
    authors: AuthorType[],
    created: number,
    modified: number,
    license: string | null,
    termsOfServiceURL: string | null,
};