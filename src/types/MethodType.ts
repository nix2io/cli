/*
 * File: MethodType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { ResponseType } from '.';

export default interface MethodType {
    label: string;
    description: string | null;
    responses: { [key: string]: ResponseType };
}
