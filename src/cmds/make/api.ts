/*
 * File: api.ts
 * Created: 10/14/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as commander from 'commander';
import { APIServiceContext, Method, Response, Author } from '../../classes';
import { getServiceContext } from '../../service';
import yaml = require('js-yaml');
import colors = require('colors');
import fs = require('fs');

const generateOpenAPI = (serviceContext: APIServiceContext) => {
    const schemas: Record<string, unknown> = {};

    for (const schema of serviceContext.schemas) {
        const id = schema.pascalCase;
        const required: string[] = Object.values(schema.fields)
            .filter((field) => field.required)
            .map((field) => field.name);
        const properties: Record<string, unknown> = {};

        for (const key in schema.fields) {
            const field = schema.fields[key];
            properties[key] = {
                description: field.description,
                type: field.type,
            };
        }

        schemas[id] = {
            required,
            properties,
        };
    }
    // error schema
    schemas['Error'] = {
        type: 'object',
        properties: {
            message: {
                type: 'string',
            },
        },
        required: ['message'],
    };

    const responses: Record<string, unknown> = {};

    const paths: Record<string, unknown> = {};
    for (const p in serviceContext.paths) {
        const path = serviceContext.paths[p],
            methods: Record<string, unknown> = {};

        for (const verb in path.methods) {
            const m = Object.values(path.methods)[
                Object.keys(path.methods).indexOf(verb)
            ];
            const method: Method = m;

            const func = (resp: Response) => {
                let response = {
                    description: resp.description,
                };
                if (resp.isError) {
                    const codeName = resp.codeInfo.label.replace(/ /g, '');
                    response = {
                        ...response,
                        ...{
                            $ref: '#/components/responses/' + codeName,
                        },
                    };

                    if (Object.keys(responses).indexOf(codeName) == -1) {
                        responses[codeName] = {
                            description: resp.codeInfo.description,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error',
                                    },
                                },
                            },
                        };
                    }
                }
                return response;
            };

            methods[verb] = {
                summary: method.label,
                description: method.description,
                responses: Object.assign(
                    {},
                    ...Object.keys(method.responses).map((k: string) => ({
                        [k]: func(method.responses[k]),
                    })),
                ),
            };
        }

        paths[p] = methods;
    }

    let contactAuthor: Author | null = null;
    const supportAuthor = serviceContext.info.getAuthorsByFlags('support');
    if (supportAuthor.length > 0) {
        contactAuthor = supportAuthor[0];
    } else {
        const publicLeadDev = serviceContext.info
            .getLeadDevs()
            .filter((dev) => dev.publicEmail != null);
        if (publicLeadDev.length > 0) {
            contactAuthor = publicLeadDev[0];
        } else {
            const publicDev = serviceContext.info
                .getDevs()
                .filter((dev) => dev.publicEmail != null);
            if (publicDev.length > 0) {
                contactAuthor = publicDev[0];
            }
        }
    }

    const data: Record<string, any> = {
        openapi: '3.0.0',
        info: {
            title: serviceContext.info.label,
            description: serviceContext.info.description,
            version: serviceContext.info.version,
            termsOfService: serviceContext.info.termsOfServiceURL,
            license: {
                name: serviceContext.info.license,
                url: 'https://nix2.io/license',
            },
        },
        paths: paths,
        components: {
            responses,
            schemas,
        },
    };

    if (contactAuthor != null) {
        data.info['contact'] = {
            email: contactAuthor.publicEmail,
        };
        if (contactAuthor.name != null)
            data.info.contact['name'] = contactAuthor.name;
        if (contactAuthor.url != null)
            data.info.contact['url'] = contactAuthor.url;
    }

    return data;
};

export default (make: commander.Command): void => {
    make.command('api')
        .description('make an api')
        .action((options) => {
            // make sure there is a service context
            const serviceContext = getServiceContext(options);
            if (serviceContext == null)
                return console.error(colors.red('No service context found'));
            if (!(serviceContext instanceof APIServiceContext))
                return console.error(colors.red('Service is not an API'));

            const api = generateOpenAPI(serviceContext);

            const content = yaml.safeDump(api);
            fs.writeFileSync('service-api.yaml', content);

            // prettyPrint(api);
        });
};
