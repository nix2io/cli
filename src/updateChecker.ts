import * as semver from 'semver';
import * as colors from 'colors';

import {
    PACKAGE_URL,
    REFRESH_VERSION_INTERVAL,
    SYMBOLS,
    VERSION,
} from './constants';

import Axios from 'axios';
import cache from './cache';

interface VersionCacheType {
    refreshed: number;
    version: string;
}

const updateCachedVersion = async (): Promise<void> => {
    console.log('checking for updates');
    await Axios.get(PACKAGE_URL).then((resp) => {
        const version = <string>resp.data.version;
        cache.set('version', { refreshed: new Date().getTime(), version });
    });
    return;
};

export const checkForUpdates = (): void => {
    const versionCacheInfo: VersionCacheType = <VersionCacheType>(
        (<unknown>cache.get('version', { refreshed: -1, version: VERSION }))
    );
    if (
        new Date().getTime() - versionCacheInfo.refreshed >=
        REFRESH_VERSION_INTERVAL
    )
        updateCachedVersion();

    if (semver.lte(versionCacheInfo.version, VERSION)) return;
    console.warn(
        colors.yellow(
            `\n${
                SYMBOLS.WARNING
            } You are using an out of date CLI: ${colors.cyan(
                VERSION,
            )} ${colors.white('→')} ${colors.cyan(
                versionCacheInfo.version,
            )}\n  https://github.com/nix2io/cli/releases/tag/v${
                versionCacheInfo.version
            }\n`,
        ),
    );
};
