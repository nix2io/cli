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

    /**
     * Read and return the file contents of package.json
     * @function readPackageFile
     * @memberof TypescriptServiceContext
     * @returns {PackageJSONType} Object of package.json
     * @returns {null}            If no package.json exists
     */
    readPackageFile(): PackageJSONType | null {
        const packagePath = join(this.serviceDirectory, 'package.json');
        if (!existsSync(packagePath)) {
            return null;
        }
        const fileContent = readFileSync(packagePath, 'utf-8');
        const fileObject = JSON.parse(fileContent);
        return <PackageJSONType>fileObject;
    }

    /**
     * Construct a package.json object
     * @function makePackageContent
     * @memberof Typescript
     * @returns {PackageJSONType} package.json object
     */
    makePackageContent(): PackageJSONType {
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

    /**
     * Write the package.json object to the file
     * @function writePackageFile
     * @memberof Typescript
     * @param {PackageJSONType} pkg package.json object
     * @returns {void}
     */
    writePackageFile(pkg: PackageJSONType): void {
        writeFileSync(
            join(this.serviceDirectory, 'package.json'),
            JSON.stringify(pkg, null, 4),
        );
    }

    /**
     * Create the package.json file
     * @function createPackageFile
     * @memberof Typescript
     * @returns {void}
     */
    createPackageFile(): void {
        this.writePackageFile(this.makePackageContent());
    }

    /**
     * Return the file header as a comment
     * @function
     * @param fileName
     */
    makeFileHeader(fileName: string) {
        return (
            '/*\n' +
            this.makeFileHeaderLines(fileName)
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

    /**
     * Make the file content for a new index.ts file
     * @function makeMainIndexFileContext
     * @memberof TypescriptServiceContext
     * @returns {string} file content
     */
    makeMainIndexFileContext(): string {
        return this.makeFileHeader('index.ts');
    }

    /**
     * Create all the files in `src/`
     * @function createSourceFiles
     * @memberof TypescriptServiceContext
     * @returns {void}
     */
    createSourceFiles(): void {
        const sourceDir = this.createSourceDirectory();
        writeFileSync(
            join(sourceDir, 'index.ts'),
            this.makeMainIndexFileContext(),
        );
    }

    /**
     * Install all packages using yarn
     * @function installPackages
     * @memberof TypescriptServiceContext
     * @returns {void}
     */
    installPackages(): void {
        execSync(`yarn --cwd ${this.serviceDirectory}`);
    }

    /**
     * Runs the post initialization commands
     *
     * 1. Runs the base post init commands
     * 2. Create the `package.json`
     * 3. Create the files for `src/`
     * 4. Install the packages
     * @function postInit
     * @memberof TypescriptServiceContext
     * @returns {void}
     */
    postInit(): void {
        super.postInit();
        this.createPackageFile();
        this.createSourceFiles();
        this.installPackages();
    }

    /**
     * Runs the post version bump commands
     *
     * 1. Runs the base version bump commands
     * 2. Update the `package.json` version
     * @function postVersionBump
     * @memberof TypescriptServiceContext
     * @returns {void}
     */
    postVersionBump(): void {
        super.postVersionBump();
        const pkg = this.readPackageFile();
        if (pkg == null) return;
        pkg.version = this.info.version;
        this.writePackageFile(pkg);
    }
}
