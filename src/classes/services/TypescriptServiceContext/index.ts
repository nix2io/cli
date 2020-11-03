/*
 * File: index.ts
 * Created: 10/31/2020 12:55:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Info, Schema, ServiceContext } from '../..';
import { PACKAGES } from '../../../constants';
import PackageJSONType from '../../../types/PackageJSONType';
import { authed, user } from '../../../user';
import ServiceFile from '../../ServiceFile';
import { execSync } from 'child_process';

export default abstract class TypescriptServiceContext extends ServiceContext {
    static NAME = 'typescript';

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
        private _dependencies: Record<string, string> = {},
        private _devDependencies: Record<string, string> = {},
        private _scripts: Record<string, string> = {},
    ) {
        super(serviceFile, info, type, schemas);
    }

    /**
     * Object of dependencies and their version
     * @memberof TypescriptServiceContext
     * @function dependencies
     * @returns {Record<string, string>} Object of package name and version
     */
    get dependencies(): Record<string, string> {
        return { ...this._dependencies, ...{} };
    }

    /**
     * Object of dev dependencies and their version
     * @memberof TypescriptServiceContext
     * @function devDependencies
     * @returns {Record<string, string>} Object of package name and version
     */
    get devDependencies(): Record<string, string> {
        return { ...this._devDependencies, ...PACKAGES.TYPESCRIPT.dev };
    }

    /**
     * Object of the scripts
     * @memberof TypescriptServiceContext
     * @function scripts
     * @returns {Record<string, string>} Object of the scripts
     */
    get scripts(): Record<string, string> {
        return { ...this._scripts, ...{} };
    }

    readPackageFile(): PackageJSONType | null {
        const packagePath = join(this.serviceDirectory, 'package.json');
        if (!existsSync(packagePath)) {
            return null;
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
            scripts: this.scripts,
        };
        if (authed) packageContent.author = `${user?.name} <${user?.email}>`;
        return packageContent;
    }

    createPackageFile() {
        writeFileSync(
            join(this.serviceDirectory, 'package.json'),
            JSON.stringify(this.createPackageContent(), null, 4),
        );
    }

    getFileHeader(fileName: string) {
        return (
            '/*\n' +
            this.getFileHeaderLines(fileName)
                .map((line) => ` * ${line}`)
                .join('\n') +
            '\n*/\n'
        );
    }

    createSourceDirectory() {
        const sourceDir = join(this.serviceDirectory, '/src');
        if (!existsSync(sourceDir)) mkdirSync(sourceDir);
        return sourceDir;
    }

    getMainIndexFileContext(): string {
        return this.getFileHeader('index.ts');
    }

    createSourceFiles() {
        const sourceDir = this.createSourceDirectory();
        writeFileSync(
            join(sourceDir, 'index.ts'),
            this.getMainIndexFileContext(),
        );
    }

    installPackages() {
        execSync(`yarn --cwd ${this.serviceDirectory}`);
    }

    postInitLogic() {
        super.postInitLogic();
        this.createPackageFile();
        this.createSourceFiles();
        this.installPackages();
    }
}
