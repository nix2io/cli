import { ServiceContextType } from '../src/types';
import { WORKING_INFO_1 } from './const_info';
import { WORKING_SCHEMA_1 } from './const_schema';

export const WORKING_SERVICE_1: ServiceContextType = {
    info: WORKING_INFO_1,
    type: 'app',
    schemas: [WORKING_SCHEMA_1],
};
export const WORKING_SERVICES = [WORKING_SERVICE_1];
