/*
 * File: Database.ts
 * Created: 11/04/2020 12:31:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

export class DatabaseInstance {
    constructor(
        public env: string,
        public id: string,
        public name: string,
        public ts: number,
    ) {}
}

export class Database {
    public environments: Set<string> = new Set();

    constructor(
        public name: string,
        private _instances: DatabaseInstance[] = [],
    ) {
        this.calculateEnvironments();
    }

    private calculateEnvironments() {
        this.environments = new Set(this._instances.map((db) => db.env));
    }

    get instances(): DatabaseInstance[] {
        return this._instances;
    }

    set instances(instances) {
        this._instances = instances;
        this.calculateEnvironments();
    }

    addInstance(instance: DatabaseInstance) {
        this._instances.push(instance);
        this.calculateEnvironments();
    }
}
