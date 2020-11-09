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
/**
 * Class for managing the service version.
 * @class VersionBump
 */
export default class VersionBump {
    /**
     * Constructor for the `VersionBump` class.
     * @param {Info} info Info object for the service.
     */
    constructor(private info: Info) {}

    /**
     * Get the version from the info.
     * @function version
     * @memberof VersionBump
     * @private
     * @returns {string} Version.
     */
    private get version(): string {
        return this.info.version;
    }

    /**
     * Increment the version of the service by a release type.
     * @function inc
     * @memberof VersionBump
     * @private
     * @example
     * // 'minor' upgrade
     * this.inc('minor'); // '1.0.2'
     * // 'major' upgrade
     * this.inc('major'); // '2.0.0'
     * @param   {string} release Semver upgrade type.
     * @returns {string}         The new version set.
     */
    private inc = (release: 'patch' | 'minor' | 'major'): string => {
        const version = semver.inc(this.version, release);
        if (version == null) throw Error(ERRORS.INVALID_SEMVER);
        return this.set(version);
    };

    /**
     * Patch upgrade.
     * @function patch
     * @memberof VersionBump
     * @returns {string} New version.
     */
    patch = (): string => this.inc('patch');

    /**
     * Minor upgrade.
     * @function patch
     * @memberof VersionBump
     * @returns {string} New version.
     */
    minor = (): string => this.inc('minor');

    /**
     * Major upgrade.
     * @function patch
     * @memberof VersionBump
     * @returns {string} New version.
     */
    major = (): string => this.inc('major');

    /**
     * Set the version to a specific version.
     * @function set
     * @memberof VersionBump
     * @param   {string} version New version.
     * @returns {string}         New version.
     */
    set(version: string): string {
        if (!semver.valid(version)) throw Error(ERRORS.INVALID_SEMVER);
        this.info.version = version;
        this.info.serviceContext?.postVersionBump();
        return version;
    }
}
