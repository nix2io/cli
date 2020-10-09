import { SERVICE_FILE_NAME } from "./constants";
const fs = require('fs');


export const getServiceContext = () => {
    let path = process.cwd() + "/" + SERVICE_FILE_NAME;
    try {
        if (fs.existsSync(path)) {
            return true;
        } else {
            return null;
        }
    } catch(err) {
        console.error(err);
        return null;
    }
}