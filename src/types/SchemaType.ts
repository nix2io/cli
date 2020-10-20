/*
 * File: SchemaType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { FieldType } from ".";


export default interface SchemaType {
    identifier: string,
    label: string,
    description: string | null,
    pluralName: string,
    fields: { [id: string]: FieldType },
};