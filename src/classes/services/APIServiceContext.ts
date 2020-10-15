import { ServiceContext, Info } from '..';
import Schema from '../Schema';


export default class APIServiceContext extends ServiceContext {
    
    constructor(
        filePath: string,
        info:     Info,
        schemas:  Schema[]
    ) {
        super(filePath, info, 'api', schemas);
    }

    static deserialize(serviceFilePath: string, data: { [key: string]: any }): ServiceContext {
        return new APIServiceContext(
            serviceFilePath,
            Info.deserialize(data.info),
            Object.values(data.schemas).map((schema: any) => Schema.deserialize(schema))
        )
    };

}