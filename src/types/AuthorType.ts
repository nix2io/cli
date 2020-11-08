/*
 * File: AuthorType.ts
 * Created: 10/20/2020 13:26:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export default interface AuthorType {
    email: string;
    name: string | null;
    publicEmail: string | null;
    url: string | null;
    alert: string;
    flags: string[];
}
