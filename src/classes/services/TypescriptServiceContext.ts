/*
 * File: APIServiceContext.ts
 * Created: 10/31/2020 12:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Info, Schema, ServiceContext } from '..';
import { PACKAGES } from '../../constants';
import PackageJSONType from '../../types/PackageJSONType';
import { authed, user } from '../../user';
import ServiceFile from '../ServiceFile';

type DependenciesType = Record<string, string>;
export default abstract class TypescriptServiceContext extends ServiceContext {
    /**
     * Class to represent a Typescript Service context
     * @class TypescriptServiceContext
     * @param {string}                  filePath        path to the service.yaml
     * @param {Info}                    info            info of the service
     * @param {Array<Schema>}           schemas         list of service schemas
     * @param {Record<string, Path>}    paths           object of paths for the API
     * @param {Record<string, string>} _dependencies    object of dependencies and their verision
     * @param {Record<string, string>} _devDependencies object of dev dependencies and their verision
     */
    constructor(
        serviceFile: ServiceFile,
        info: Info,
        type: string,
        schemas: Schema[],
        private _dependencies: DependenciesType = {},
        private _devDependencies: DependenciesType = {},
    ) {
        super(serviceFile, info, type, schemas);
    }

    /**
     * Object of dependencies and their version
     * @memberof TypescriptServiceContext
     * @function dependencies
     * @returns {Record<string, string>} Object of package name and version
     */
    get dependencies(): DependenciesType {
        return { ...this._dependencies, ...{} };
    }

    /**
     * Object of dev dependencies and their version
     * @memberof TypescriptServiceContext
     * @function devDependencies
     * @returns {Record<string, string>} Object of package name and version
     */
    get devDependencies(): DependenciesType {
        return { ...this._devDependencies, ...PACKAGES.TYPESCRIPT.dev };
    }

    readPackageFile(): PackageJSONType {
        let tempdir = '.';
        // TODO: remove this
        tempdir = join(this.serviceDirectory, '/serv');
        const packagePath = join(tempdir, '/package.json');
        if (!existsSync(packagePath)) {
            throw Error('FILE_NOT_EXIST');
        }
        const fileContent = readFileSync(packagePath, 'utf-8');
        const fileObject = JSON.parse(fileContent);
        return <PackageJSONType>fileObject;
    }

    createPackageContent() {
        const packageContent: PackageJSONType = {
            name: this.info.identifier,
            description: this.info.description || '',
            version: this.info.version || '1.0.0',
            main: './dist/index.js',
            license: this.info.license || 'CC-BY-1.0',
            dependencies: this.dependencies,
            devDependencies: this.devDependencies,
        };
        if (authed) packageContent.author = `${user?.name} <${user?.email}>`;
        return packageContent;
    }
}
