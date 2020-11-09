/*
 * File: index.ts
 * Created: 11/09/2020 12:28:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { Info, Schema, ServiceContext, User } from '../..';
import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { MakeObjectType, SchemaType, ServiceContextType } from '../../../types';

type RequirementType = {
    name: string;
    symbol: string;
    version: string;
};

/**
 * Class to represent a Python Service context.
 * @class PythonServiceContext
 */
export default class PythonServiceContext extends ServiceContext {
    static NAME = 'python';

    /**
     * Constructor for the Python service context.
     * @param {string}                  serviceFilePath Path to the service.yaml.
     * @param {Info}                    info            `Info` object of the service.
     * @param {string}                  type            The type of Python service.
     * @param {Array<Schema>}           schemas         List of service schemas.
     * @param {Record<string, string>} _requirements    Object of requirements and their verision.
     */
    constructor(
        serviceFilePath: string,
        info: Info,
        type: string,
        schemas: Schema[],
        private _requirements: Record<string, string> = {},
    ) {
        super(serviceFilePath, info, type, schemas);
    }

    /**
     * Deserialize an object into an `PythonServiceContext` instance.
     * @function deserialize
     * @static
     * @memberof PythonServiceContext
     * @param   {string} serviceFilePath Path to the service.yaml.
     * @param   {object} data            Javascript object of the `Info`.
     * @returns {PythonServiceContext}   Service context object.
     */
    static deserialize(
        serviceFilePath: string,
        data: ServiceContextType,
    ): PythonServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new PythonServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            'python',
            Object.values(data.schemas).map((schema: SchemaType) =>
                Schema.deserialize(schema),
            ),
        );
    }

    /**
     * Make a `PythonServiceContext` object.
     * @static
     * @param   {MakeObjectType}       data Data for the `PythonServiceContext` object.
     * @param   {User}                 user User instance.
     * @returns {PythonServiceContext}      New `PythonServiceContext` object.
     */
    static makeObject(
        data: MakeObjectType,
        user: User | null,
    ): ServiceContextType {
        return {
            ...super.makeObject(data, user),
            ...{
                type: 'python',
            },
        };
    }

    /**
     * Serialize a `PythonServiceContext` instance into an object.
     * @function serialize
     * @memberof PythonServiceContext
     * @returns  {ServiceContextType} Javascript object.
     */
    serialize(): ServiceContextType {
        return {
            ...super.serialize(),
            ...{
                type: 'python',
            },
        };
    }

    /**
     * Object of requirements and their version.
     * @memberof PythonServiceContext
     * @function requirements
     * @returns {Record<string, string>} Object of requirement name and version.
     */
    get requirements(): Record<string, string> {
        return { ...this._requirements, ...{} };
    }

    /**
     * Read and return the requirements.txt file.
     * @function readRequirementsFile
     * @memberof PythonServiceContext
     * @returns {RequirementType[] | null} List of requirements from the requirements.txt file.
     */
    readRequirementsFile(): RequirementType[] | null {
        const requirementsPath = join(
            this.serviceDirectory,
            'requirements.txt',
        );
        if (!existsSync(requirementsPath)) {
            return null;
        }
        const fileContent = readFileSync(requirementsPath, 'utf-8');
        const requirements: RequirementType[] = [];
        for (const line of fileContent.split('\n')) {
            let name: string, version: string;
            try {
                [name, version] = line.includes('==')
                    ? line.split('==')
                    : line.split('>=');
                const symbol = line.split(name)[1];
                requirements.push({ name, symbol, version });
            } catch (err) {
                throw Error('invalid requirements file');
            }
        }
        return requirements;
    }

    /**
     * Make requirements list.
     * @function makeRequirements
     * @memberof PythonServiceContext
     * @returns {RequirementType[]} List of requirements.
     */
    makeRequirements(): RequirementType[] {
        return [];
    }

    /**
     * Write the requirements.txt object to the file.
     * @function writeRequirementsFile
     * @memberof PythonServiceContext
     * @param {RequirementType[]} requirements List of requirements.
     * @returns {void}
     */
    writeRequirementsFile(requirements: RequirementType[]): void {
        writeFileSync(
            join(this.serviceDirectory, 'requirements.txt'),
            requirements
                .map(
                    (requirement) =>
                        `${requirement.name}${requirement.symbol}${requirement.version}`,
                )
                .join('\n'),
        );
    }

    /**
     * Create the requirements.txt file.
     * @function createRequirementsFile
     * @memberof PythonServiceContext
     * @returns {void}
     */
    createRequirementsFile(): void {
        this.writeRequirementsFile(this.makeRequirements());
    }

    /**
     * Return the file header as a comment.
     * @function makeFileHeader
     * @memberof PythonServiceContext
     * @param   {string} fileName File name for the header.
     * @returns {string}          Header for the Python file.
     */
    makeFileHeader(fileName: string): string {
        return (
            this.makeFileHeaderLines(fileName)
                .map((line) => `# ${line}`)
                .join('\n') + '\n'
        );
    }

    /**
     * Make the file content for a new app.py file.
     * @function makeMainIndexFileContext
     * @memberof PythonServiceContext
     * @returns {string} File content.
     */
    makeMainAppFileContent(): string {
        return this.makeFileHeader('app.py');
    }

    /**
     * Create all the files in `src/`.
     * @function createSourceFiles
     * @memberof PythonServiceContext
     * @returns {void}
     */
    createSourceFiles(): void {
        writeFileSync(
            join(this.serviceDirectory, 'app.py'),
            this.makeMainAppFileContent(),
        );
    }

    /**
     * Install all requirements using pip.
     * @function installRequirements
     * @memberof PythonServiceContext
     * @returns {void}
     */
    installRequirements(): void {
        execSync(`pip install -r requirements.txt`);
    }

    /**
     * Runs the post initialization commands.
     *
     * 1. Runs the base post init commands.
     * 2. Create the `requirements.txt`.
     * 3. Create the files.
     * 4. Install the requirements.
     * @function postInit
     * @memberof PythonServiceContext
     * @returns {void}
     */
    postInit(): void {
        super.postInit();
        this.createRequirementsFile();
        this.createSourceFiles();
    }

    /**
     * Make the ingore components to get sent to the ignore generation service.
     * @function makeIgnoreComponents
     * @memberof PythonServiceContext
     * @returns {string[]} Ignore components.
     */
    makeIgnoreComponents(): string[] {
        return super.makeIgnoreComponents().concat(['python']);
    }
}
