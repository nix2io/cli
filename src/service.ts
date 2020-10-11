import { SERVICE_FILE_NAME, ERRORS } from "./constants";
import { ServiceContext, Info, Author } from './classes';
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
const parseServiceObject = (serviceObject: any): ServiceContext => {
    const infoObj = serviceObject.info;
    let authors: Author[] = [];
    for (let authorObj of infoObj.authors) {
        authors.push(
            new Author(
                authorObj.name,
                authorObj.email,
                authorObj.publicEmail,
                authorObj.url,
                authorObj.alert,
                new Set(authorObj.flags)
            )
        )
    }
    return new ServiceContext(
        new Info(
            infoObj.identifier,
            infoObj.label,
            infoObj.description,
            infoObj.version,
            authors,
            infoObj.license,
            infoObj.termsOfServiceURL
        ),
        serviceObject.type
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
    return parseServiceObject(obj);
    
}