/*
 * File: VersionBump.ts
 * Created: 11/07/2020 14:36:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as semver from 'semver';
import { ERRORS } from '../constants';
import Info from './Info';

export default class VersionBump {
    constructor(private info: Info) {}

    private get version() {
        return this.info.version;
    }

    inc = (release: 'patch' | 'minor' | 'major') =>
        this.set(semver.inc(this.version, release));

    patch = () => this.inc('patch');

    minor = () => this.inc('minor');

    major = () => this.inc('major');

    set(version: string | null) {
        if (version == null) throw Error('version is null for some reason');
        if (!semver.valid(version)) throw Error(ERRORS.INVALID_SEMVER);
        this.info.version = version;
        this.info.serviceContext?.postVersionBump();
        return version;
    }
}
