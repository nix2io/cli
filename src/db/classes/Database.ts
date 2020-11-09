/*
 * File: Database.ts
 * Created: 11/04/2020 12:31:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

/**
 * Class to represent a database instance.
 * @class DatabaseInstace
 */
export class DatabaseInstance {
    /**
     * Constructor for a `DatabaseInstace`.
     * @param {string} environment Environment of the database.
     * @param {string} identifier  Database identifier.
     * @param {string} name        Database name.
     * @param {number} ts          Database creation timestamp?
     */
    constructor(
        public environment: string,
        public identifier: string,
        public name: string,
        public ts: number,
    ) {}
}

/**
 * Class to represent a database.
 * @class Database
 */
export class Database {
    public environments: Set<string> = new Set();

    /**
     * Constructor for a `Database`.
     * @param {string}             name       Database name.
     * @param {DatabaseInstance[]} _instances List of instances for the database.
     */
    constructor(
        public name: string,
        private _instances: DatabaseInstance[] = [],
    ) {
        this.computeEnvironments();
    }

    /**
     * Compute the set of environments.
     * @function computeEnvironments
     * @memberof Database
     * @private
     * @returns {void}
     */
    private computeEnvironments(): void {
        this.environments = new Set(
            this._instances.map((db) => db.environment),
        );
    }

    /**
     * Getter for instances.
     * @function get
     * @memberof Database
     * @returns {DatabaseInstance[]} List of instances for the database.
     */
    get instances(): DatabaseInstance[] {
        return this._instances;
    }

    /**
     * Setter for instances.
     *
     * Once set, the environments will be re-computed.
     * @function set
     * @memberof Database
     */
    set instances(instances: DatabaseInstance[]) {
        this._instances = instances;
        this.computeEnvironments();
    }

    /**
     * Adds an instance and re-computes the environments.
     * @function addInstance
     * @memberof Database
     * @param   {DatabaseInstance} instance Database instance to be added.
     * @returns {DatabaseInstance}          The database instance given.
     */
    addInstance(instance: DatabaseInstance): DatabaseInstance {
        this._instances.push(instance);
        this.computeEnvironments();
        return instance;
    }
}
