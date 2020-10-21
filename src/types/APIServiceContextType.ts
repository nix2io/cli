/*
 * File: APIServiceContextType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { PathType, ServiceContextType } from '.';

export default interface APIServiceContextType extends ServiceContextType {
    paths: { [key: string]: PathType };
}
