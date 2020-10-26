/*
 * File: ServiceFile.ts
 * Created: 10/23/2020 11:25:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import YAWN from '../yawn';

export default class ServiceFile {
    constructor(public path: string, public YAWNObject: YAWN) {}

    getJSON() {
        return this.YAWNObject.json;
    }
}
