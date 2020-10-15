/*
 * File: api.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import * as commander from "commander";
import { ServiceContext, APIServiceContext, Method } from "../../classes";
import { getServiceContext } from "../../service";
import { prettyPrint } from "koontil";
const colors = require('colors');


const generateOpenAPI = (serviceContext: APIServiceContext) => {

    let schemas: { [key: string]: any } = {};

    for (let schema of serviceContext.schemas) {
        let id = schema.pascalCase;
        let required: string[] = Object.values(schema.fields).filter(field => field.required).map(field => field.name);
        let properties: { [key: string]: any } = {};

        for (let key in schema.fields) {
            let field = schema.fields[key];
            properties[key] = {
                description: field.description,
                type:        field.type
            }
        }

        schemas[id] = {
            required,
            properties
        }
    }

    let paths: {[key: string]: any} = {};
    for (let p in serviceContext.paths) {
        let path = serviceContext.paths[p],
            methods: {[key: string]: any} = {};

        for (let verb in path.methods) {
            // TODO: fix this
            // @ts-ignore
            let m = path.methods[verb];
            let method: Method = m;

            methods[verb] = {
                summary: method.label,
                description: method.description
            }
        }
        
        paths[p] = methods;
    }

    return {
        openapi: "3.0.0",
        info: {
            title: serviceContext.info.label,
            description: serviceContext.info.description,
            version: serviceContext.info.version
        },
        paths: paths,
        components: {
            schemas
        }
    }

}



export default (make: commander.Command) => {
    
    make
        .command('api')
        .description('make an api')
        .action(() => {
            // make sure there is a service context            
            let serviceContext = getServiceContext();
            if (serviceContext == null) return console.error(colors.red('No service context found'));
            if (!(serviceContext instanceof APIServiceContext)) return console.error(colors.red('Service is not an API'));

            let api = generateOpenAPI(serviceContext);

            prettyPrint(api);
            


        });   
}