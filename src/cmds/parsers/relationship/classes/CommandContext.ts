/*
 * File: Node.ts
 * Created: 10/26/2020 19:58:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

class LinkedSchemas {
    public schemas: { [key: string]: Set<string> } = {};

    add(schema: string, parent: string) {
        if (Object.keys(this.schemas).indexOf(schema) == -1) {
            this.schemas[schema] = new Set();
        }
        this.schemas[schema].add(parent);
    }
}
export default class CommandContext {
    
    public linked = new LinkedSchemas();
    public schemas: Set<string> = new Set();

}