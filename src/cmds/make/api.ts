import * as commander  from "commander";
import { ServiceContext } from "../../classes";
import { getServiceContext } from "../../service";
import { prettyPrint } from "koontil";
const colors = require('colors');


const generateOpenAPI = (serviceContext: ServiceContext) => {

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


    return {
        openapi: "3.0.0",
        info: {
            title: serviceContext.info.label,
            description: serviceContext.info.description,
            version: serviceContext.info.version
        },
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

            let api = generateOpenAPI(serviceContext);

            prettyPrint(api);
            


        });   
}