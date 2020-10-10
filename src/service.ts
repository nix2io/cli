import { SERVICE_FILE_NAME } from "./constants";
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// check if the file exists
const serviceFileExists = (serviceFilePath: string): boolean => {
    try { return fs.existsSync(serviceFilePath); } 
    catch(err) { throw new Error("Could not check if file exists"); }
}

// get the file from the path
const getServiceFile = (serviceFilePath: string): File => {
    try { return fs.readFileSync(serviceFilePath, 'utf-8'); }
    catch (err) { throw new Error("Could not read service.yaml"); }
}

// returns a js object from the yaml
const getServiceObject = (file: File): object => {
    try {
        // parse the file's yaml
        const serviceObject = yaml.load(file);
        // throw an error if the response is anything but an object
        if (typeof serviceObject != "object") throw new Error("Could not parse yaml");
        return serviceObject;
    } catch (err) { throw new Error("Could not parse yaml"); }
}

export const getServiceContext = (): object|null => {
    const serviceFilePath = path.join(process.cwd(), SERVICE_FILE_NAME);
    if (!serviceFileExists(serviceFilePath)) return null;
    const file = getServiceFile(serviceFilePath);
    return getServiceObject(file);           
    
}