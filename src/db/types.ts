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

export type ServiceDatabaseRef = {
    '@ref': {
        id: string;
        collection: {
            '@ref': {
                id: string;
            };
        };
        database: {
            '@ref': {
                id: string;
                collection: {
                    '@ref': {
                        id: string;
                    };
                };
            };
        };
    };
};

export type ServiceDatabaseType = DatabaseType<ServiceDatabaseRef>;

export type EnvironmentDatabasesType = {
    data: DatabaseListType<ServiceDatabaseRef>[];
};
