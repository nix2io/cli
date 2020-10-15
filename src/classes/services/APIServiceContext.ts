/*
 * File: APIServiceContext.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { ServiceContext, Info } from '..';
import { Schema, Path } from '..';


export default class APIServiceContext extends ServiceContext {
    
    public paths: {[key: string]: Path};

    constructor(
        filePath: string,
        info:     Info,
        schemas:  Schema[],
        paths:    {[key: string]: Path}
    ) {
        super(filePath, info, 'api', schemas);
        this.paths = paths;
    }

    static deserialize(serviceFilePath: string, data: { [key: string]: any }): ServiceContext {
        return new APIServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) => Schema.deserialize(schema)),
            Object.assign({}, ...Object.keys(data.paths).map(k => ({[k]: Path.deserialize(k, data.paths[k])})))
        )
    };

    serialize() {
        return {...super.serialize(), ...{
            paths: Object.assign({}, ...Object.keys(this.paths).map((k: string) => ({[k]: this.paths[k].serialize()})))
        }}
    }

}