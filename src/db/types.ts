export interface FaunaDBResponse<T> {
    ref: {
        id: string;
    };
    data: T;
    ts: number;
}

export type DatabaseType<T> = {
    ref: T;
    ts: number;
    name: string;
    global_id: string;
};

export type DatabaseListType<T> = {
    data: DatabaseType<T>[];
};

export type DatabaseRef = {
    '@ref': {
        id: string;
        collection: {
            '@ref': {
                id: string;
            };
        };
    };
};

export type ServiceDatabaseType = DatabaseType<DatabaseRef>;

export type EnvironmentDatabasesType = {
    data: DatabaseListType<DatabaseRef>[];
};

export type KeyType = {
    ref: DatabaseRef;
    ts: number;
    role: string;
    database: DatabaseRef;
    secret: string;
    hashed_secret: string;
};
