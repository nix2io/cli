/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { TypescriptServiceContext } from '..';
import { Info, Schema, User } from '../..';
import {
    GraphQLServiceContextType,
    MakeObjectType,
    SchemaType,
} from '../../../types';

type DependenciesType = Record<string, string>;

/**
 * Class for representing a GraphQL Service.
 * @class GraphQLServiceContext
 */
export default class GraphQLServiceContext extends TypescriptServiceContext {
    static NAME = 'graphql';
    static DIRNAME: string = __dirname;

    /**
     * Constructor for the GraphQL service context.
     * @param {string}               serviceFilePath Path to the service.yaml.
     * @param {Info}                 info            Info of the service.
     * @param {Array<Schema>}        schemas         List of service schemas.
     */
    constructor(serviceFilePath: string, info: Info, schemas: Schema[]) {
        super(serviceFilePath, info, 'graphql', schemas);
    }

    /**
     * Deserialize an object into an `GraphQLServiceContext` instance.
     * @function deserialize
     * @static
     * @memberof GraphQLServiceContext
     * @param   {string} serviceFilePath Path to the service.yaml.
     * @param   {object} data            Javascript object of the `Info`.
     * @returns {GraphQLServiceContext}  Service context object.
     */
    static deserialize(
        serviceFilePath: string,
        data: GraphQLServiceContextType,
    ): GraphQLServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new GraphQLServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: SchemaType) =>
                Schema.deserialize(schema),
            ),
        );
    }

    /**
     * Make a `GraphQLServiceContext` object.
     * @static
     * @param   {MakeObjectType}       data Data for the `GraphQLServiceContext` object.
     * @param   {User}                 user User instance.
     * @returns {GraphQLServiceContextType} New `GraphQLServiceContext` object.
     */
    static makeObject(
        data: MakeObjectType,
        user: User,
    ): GraphQLServiceContextType {
        return {
            ...super.makeObject(data, user),
            ...{
                type: 'graphql',
            },
        };
    }

    /**
     * Serialize a `GraphQLServiceContext` instance into an object.
     * @function serialize
     * @memberof GraphQLServiceContext
     * @returns  {GraphQLServiceContextType} Javascript object.
     */
    serialize(): GraphQLServiceContextType {
        return {
            ...super.serialize(),
            ...{
                type: 'graphql',
            },
        };
    }

    /**
     * GraphQL specifc dependencies.
     * @memberof GraphQLServiceContext
     * @function dependencies
     * @returns {Record<string, string>} Object of package name and version.
     */
    get dependencies(): DependenciesType {
        return {
            ...super.dependencies,
            ...{
                'apollo-server-express': '^2.19.0',
                express: '^4.17.1',
                graphql: '^15.4.0',
                'reflect-metadata': '^0.1.13',
                'type-graphql': '^1.1.0',
                typeorm: '^0.2.29',
            },
        };
    }

    /**
     * Object of dev dependencies and their version.
     * @memberof GraphQLServiceContext
     * @function devDependencies
     * @returns {Record<string, string>} Object of package name and version.
     */
    get devDependencies(): DependenciesType {
        return {
            ...super.devDependencies,
            ...{
                '@types/express': '^4.17.8',
                '@types/graphql': '^14.5.0',
                nodemon: '^2.0.6',
            },
        };
    }

    /**
     * Object of the scripts.
     * @function scripts
     * @memberof GraphQLServiceContext
     * @returns {Record<string, string>} Object of the scripts.
     */
    get scripts(): Record<string, string> {
        return {
            ...super.scripts,
            ...{
                start: 'nodemon --exec ts-node ./src/index.ts',
            },
        };
    }

    /**
     * Read the contents of the template file for a GraphQL.
     * @function getTemplate
     * @memberof GraphQLServiceContext
     * @example
     * // Returns the file content for index.ts
     * serviceContext.getTemplate('index.ts') // import graphql from 'graphql'
     * @param   {string} fileName Name of a file.
     * @returns {string}          GraphQL file template.
     */
    readTemplate = (fileName: string): string =>
        super.readTemplate('GraphQLServiceContext', fileName);

    /**
     * Make the main `index.ts` file content.
     * @function makeMainIndexFileContext
     * @returns {string} `index.ts` file content.
     */
    makeMainIndexFileContext(): string {
        return super.makeMainIndexFileContext() + this.readTemplate('index.ts');
    }

    /**
     * Event listener for after an initialization.
     * @function postInit
     * @memberof GraphQLServiceContext
     * @returns {void}
     */
    postInit(): void {
        super.postInit();
    }
}
