/*
 * File: api.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as commander  from "commander";
import { ServiceContext, APIServiceContext, Method, Response, Author } from "../../classes";
import { getServiceContext } from "../../service";
import { prettyPrint } from "koontil";
const yaml = require('js-yaml');
const colors = require('colors');
const fs = require('fs');


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
    // error schema
    schemas['Error'] = {
        type: 'object',
        properties: {
            message: {
                type: 'string'
            },
        },
        required: [
            'message'
        ]
    }

    let responses: {[key: string]: any} = {};

    let paths: {[key: string]: any} = {};
    for (let p in serviceContext.paths) {
        let path = serviceContext.paths[p],
            methods: {[key: string]: any} = {};

        for (let verb in path.methods) {
            // TODO: fix this
            // @ts-ignore
            let m = path.methods[verb];
            let method: Method = m;

            const func = (resp: Response) => {
                let response = {
                    description: resp.description
                }
                if (resp.isError) {
                    let codeName = resp.codeInfo.label.replace(/ /g, "");
                    response = {...response, ...{
                        $ref: '#/components/responses/' + codeName
                    }};

                    if (Object.keys(responses).indexOf(codeName) == -1) {
                        responses[codeName] = {
                            description: resp.codeInfo.description,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        };
                    }


                }
                return response;
            }

            methods[verb] = {
                summary: method.label,
                description: method.description,
                responses: Object.assign({}, ...Object.keys(method.responses).map((k: string) => ({[k]: func(method.responses[k])})))
            }
        }
        
        paths[p] = methods;
    }

    let contactAuthor: Author|null = null;
    let supportAuthor = serviceContext.info.getAuthorsByFlags('support');
    if (supportAuthor.length > 0) {
        contactAuthor = supportAuthor[0];
    } else {
        let publicLeadDev = serviceContext.info.getLeadDevs().filter(dev => dev.publicEmail != null);
        if (publicLeadDev.length > 0) {
            contactAuthor = publicLeadDev[0];
        } else {
            let publicDev = serviceContext.info.getDevs().filter(dev => dev.publicEmail != null);
            if (publicDev.length > 0 ) {
                contactAuthor = publicDev[0];
            }
        }
    }

    let data: {[key: string]: any} = {
        openapi: "3.0.0",
        info: {
            title: serviceContext.info.label,
            description: serviceContext.info.description,
            version: serviceContext.info.version,
            termsOfService: serviceContext.info.termsOfServiceURL,
            license: {
                name: serviceContext.info.license,
                url: 'https://nix2.io/license'
            }
        },
        paths: paths,
        components: {
            responses,
            schemas
        }
    };
    
    if (contactAuthor != null) {
        data.info['contact'] = {
            email: contactAuthor.publicEmail,
        }
        if (contactAuthor.name != null) data.info.contact['name'] = contactAuthor.name;
        if (contactAuthor.url != null) data.info.contact['url'] = contactAuthor.url;
    }

    return data;

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

            let content = yaml.safeDump(api);
            fs.writeFileSync('service-api.yaml', content);

            // prettyPrint(api);
            


        });   
}