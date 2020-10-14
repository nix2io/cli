import { SERVICE_FILE_NAME, ERRORS } from "./constants";
import { ServiceContext, Info, Author } from './classes';
import Schema from "./classes/Schema";
import Field from "./classes/Field";
import { description } from "commander";
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// check if the file exists
const serviceFileExists = (serviceFilePath: string): boolean => {
    try { return fs.existsSync(serviceFilePath); } 
    catch(err) { throw new Error(ERRORS.NO_CHECK_FOR_FILE); }
}

// get the file from the path
const getServiceFile = (serviceFilePath: string): File => {
    try { return fs.readFileSync(serviceFilePath, 'utf-8'); }
    catch (err) { throw new Error(ERRORS.NO_OPEN_FILE); }
}

// returns a js object from the yaml
const getServiceObject = (file: File): object => {
    try {
        // parse the file's yaml
        const serviceObject = yaml.load(file);
        // throw an error if the response is anything but an object
        if (typeof serviceObject != "object") throw new Error(ERRORS.INVALID_YAML);
        return serviceObject;
    } catch (err) { throw new Error(ERRORS.INVALID_YAML); }
}

// parse the object into a ServiceContext instance
// TODO: change any to a "shape of" thing that describes the service context shape
const parseServiceObject = (serviceFilePath: string, serviceObject: any): ServiceContext => {
    const infoObj = serviceObject.info;
    // authors
    let authors: Author[] = [];
    for (let authorObj of infoObj.authors) {
        authors.push(
            new Author(
                authorObj.email,
                authorObj.name || null,
                authorObj.publicEmail || null,
                authorObj.url || null,
                authorObj.alert || 'none',
                new Set(authorObj.flags)
            )
        )
    }
    // schemas
    let schemas: Schema[] = [];
    for (let schemaObj of serviceObject.schemas || []) {
        let fields: {[id: string]: Field} = {};
        for (let id in schemaObj.fields) {
            let fieldObj = schemaObj.fields[id],
                defaultValue = fieldObj.default || null,
                required = fieldObj.required || false
            if (typeof fieldObj.type == "undefined") throw new Error("type not given in field");
            if (required && defaultValue == null) throw new Error("a required field can't have a default value of null");

            fields[id] = new Field(
                fieldObj.label || null,
                fieldObj.description || null,
                fieldObj.type,
                required,
                defaultValue,
                new Set(fieldObj.flags)
            )
        }
        schemas.push(new Schema(
            schemaObj.identifier,
            schemaObj.label,
            schemaObj.description,
            schemaObj.pluralName,
            fields
        ))
    }
    return new ServiceContext(
        serviceFilePath,
        new Info(
            infoObj.identifier,
            infoObj.label || null,
            infoObj.description || null,
            infoObj.version,
            authors,
            infoObj.created,
            infoObj.modified,
            infoObj.license || null,
            infoObj.termsOfServiceURL || null
        ),
        serviceObject.type,
        schemas
    )
}

export const getServiceContext = (): ServiceContext|null => {
    // get the full file path
    const serviceFilePath = path.join(process.cwd(), SERVICE_FILE_NAME);
    // return null if there is no file
    if (!serviceFileExists(serviceFilePath)) return null;
    // get the file
    const file = getServiceFile(serviceFilePath);
    // get the service object
    const obj = getServiceObject(file);
    // parse and return the service context 
    return parseServiceObject(serviceFilePath, obj);
    
}