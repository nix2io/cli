/*
 * File: ServiceContextType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { InfoType, SchemaType } from ".";


export default interface ServiceContextType {
    info: InfoType,
    type: string,
    schemas: SchemaType[],
};