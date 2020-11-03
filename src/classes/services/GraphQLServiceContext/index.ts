/*
 * File: index.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import { TypescriptServiceContext } from '..';
import { Info, Schema } from '../..';
import { GraphQLServiceContextType } from '../../../types';
import ServiceFile from '../../ServiceFile';

type DependenciesType = Record<string, string>;
export default class GraphQLServiceContext extends TypescriptServiceContext {
    static NAME = 'graphql';
    static DIRNAME: string = __dirname;

    /**
     * Class to represent an GraphQL Service context
     * @class GraphQLServiceContext
     * @param {string}               filePath path to the service.yaml
     * @param {Info}                 info     info of the service
     * @param {Array<Schema>}        schemas  list of service schemas
     */
    constructor(serviceFile: ServiceFile, info: Info, schemas: Schema[]) {
        super(serviceFile, info, 'graphql', schemas);
    }

    /**
     * Deserialize an object into an `GraphQLServiceContext` instance
     * @function deserialize
     * @static
     * @memberof GraphQLServiceContext
     * @param   {string} serviceFilePath path to the service.yaml
     * @param   {object} data            Javascript object of the Info
     * @returns {GraphQLServiceContext}      Service context object
     */
    static deserialize(
        serviceFile: ServiceFile,
        data: GraphQLServiceContextType,
    ): GraphQLServiceContext {
        // Test if the values are present
        const vals = ['info', 'schemas'];
        for (const val of vals) {
            if (Object.keys(data).indexOf(val) == -1)
                throw Error(val + ' not given');
        }

        return new GraphQLServiceContext(
            serviceFile,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) =>
                Schema.deserialize(schema),
            ),
        );
    }

    static createObject(
        data: {
            identifier: string;
            label: string;
            description: string;
            userLeadDev: boolean;
        },
        user: any,
    ): GraphQLServiceContextType {
        return {
            ...super.createObject(data, user),
            ...{
                type: 'graphql',
            },
        };
    }

    /**
     * Serialize a `GraphQLServiceContext` instance into an object
     * @function serialize
     * @memberof GraphQLServiceContext
     * @returns  {GraphQLServiceContextType} Javascript object
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
     * GraphQL specifc dependencies
     * @memberof GraphQLServiceContext
     * @function dependencies
     * @returns {Record<string, string>} Object of package name and version
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
     * Object of dev dependencies and their version
     * @memberof GraphQLServiceContext
     * @function devDependencies
     * @returns {Record<string, string>} Object of package name and version
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
     * Object of the scripts
     * @memberof GraphQLServiceContext
     * @function scripts
     * @returns {Record<string, string>} Object of the scripts
     */
    get scripts(): Record<string, string> {
        return {
            ...super.scripts,
            ...{
                start: 'nodemon --exec ts-node ./src/index.ts',
            },
        };
    }

    getTemplate = (fileName: string) =>
        super.getTemplate('GraphQLServiceContext', fileName);

    getMainIndexFileContext(): string {
        return super.getMainIndexFileContext() + this.getTemplate('index.ts');
    }

    postInitLogic() {
        super.postInitLogic();
    }
}
