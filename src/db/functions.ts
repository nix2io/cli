import { Client, query } from 'faunadb';
import { DatabaseListType } from '.';
import { DEFAULT_ENVIRONMENT, ENVIRONMENTS } from '../constants';
import { Database, DatabaseInstance, Key } from './classes';
import { DatabaseRef, ServiceDatabaseType, KeyType } from './types';
const {
    Databases,
    Paginate,
    // Select,
    Get,
    Map,
    Lambda,
    Var,
    CreateDatabase,
    // MoveDatabase,
    Database: DB,
    CreateKey,
    // Let,
    // Exists,
    // Equals,
    // Not,
    // If,
} = query;

const explodeDatabaseName = (
    dbName: string,
): { dbEnv: string; dbName: string } => {
    const dbEnv = dbName.split('-')[0];
    dbName = dbName.replace(`${dbEnv}-`, '');
    return { dbEnv, dbName };
};

export const getAllDatabases = async (client: Client): Promise<Database[]> => {
    const result = <DatabaseListType<DatabaseRef>>(
        await client
            .query(Map(Paginate(Databases()), Lambda('X', Get(Var('X')))))
            .catch((err) => {
                console.error(err);
            })
    );
    const databases: Record<string, Database> = {};
    for (const database of result.data) {
        const dbId = database.global_id;
        const dbTS = database.ts;
        const { dbEnv, dbName } = explodeDatabaseName(database.name);
        if (Object.keys(databases).indexOf(dbName) == -1) {
            databases[dbName] = new Database(dbName);
        }
        databases[dbName].addInstance(
            new DatabaseInstance(dbEnv, dbId, dbName, dbTS),
        );
    }
    return Object.values(databases);
};

export const getDatabases = async (
    client: Client,
    name: string,
): Promise<Database> => {
    const result = <ServiceDatabaseType>(
        await client
            .query(
                Map(
                    Object.values(ENVIRONMENTS),
                    Lambda('db', Get(DB(name, DB(Var('db'))))),
                ),
            )
            .catch((err) => {
                console.error(err);
            })
    );
    return new Database(result.global_id);
};

export const getDatabase = async (
    client: Client,
    name: string,
    environment: string = DEFAULT_ENVIRONMENT,
): Promise<DatabaseInstance | null> => {
    const result = <ServiceDatabaseType>(
        await client.query(Get(DB(`${environment}-${name}`))).catch((err) => {
            if (err.message == 'invalid ref') {
                return null;
            }
            throw Error(err);
        })
    );
    if (result == null) return null;
    const { dbEnv, dbName } = explodeDatabaseName(result.name);
    return new DatabaseInstance(dbEnv, result.global_id, dbName, result.ts);
};

export const createDatabase = async (
    client: Client,
    name: string,
    environment: string = DEFAULT_ENVIRONMENT,
): Promise<DatabaseInstance | null> => {
    const result = <ServiceDatabaseType>(
        await client
            .query(CreateDatabase({ name: `${environment}-${name}` }))
            .catch((err) => {
                console.error(err);
                throw err;
            })
    );
    const { dbEnv, dbName } = explodeDatabaseName(result.name);
    return new DatabaseInstance(dbEnv, result.global_id, dbName, result.ts);
};

export const createDatabaseKey = async (
    client: Client,
    name: string,
    environment: string,
    keyName: string | null = null,
): Promise<Key> => {
    keyName = keyName || `${name}-access`;
    const result = <KeyType>(<unknown>await client
        .query(
            CreateKey({
                role: 'server',
                database: DB(`${environment}-${name}`),
                name: keyName,
            }),
        )
        .catch((err) => {
            console.error(err);
        }));
    return new Key(keyName, result.secret);
};

// export const createKeys = async (client: Client, name: string) => {
//     const result = await client
//         .query(
//             Map(
//                 Object.values(ENVIRONMENTS),
//                 Lambda(
//                     'env',
//                     Let(
//                         { db: DB(name, DB(Var('env'))) },
//                         If(
//                             Exists(Var('db')),
//                             CreateKey({
//                                 role: 'server',
//                                 database: Var('db'),
//                             }),
//                             null,
//                         ),
//                     ),
//                 ),
//             ),
//         )
//         .catch((err) => {
//             console.error(err);
//         });
//     console.log(result);
// };
