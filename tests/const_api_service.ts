import { APIServiceContextType } from '../src/types';
import { WORKING_INFO_1 } from './const_info';
import { WORKING_SCHEMA_1 } from './const_schema';


export const WORKING_API_SERVICE_1: APIServiceContextType = {
    info: WORKING_INFO_1,
    type: 'api',
    schemas: [
        WORKING_SCHEMA_1
    ],
    paths: {
        '/users': {
            'get': {
                label: 'Get all users',
                description: null,
                responses: {
                    '200': {
                        description: 'Success',
                        errorMessage: null,
                        returnType: null
                    }
                }
            }
        }
    }
}
export const WORKING_API_SERVICES = [
    WORKING_API_SERVICE_1
]