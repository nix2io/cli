import { SchemaType } from '../src/types';
import { WORKING_FIELD_1 } from './const_field';

export const WORKING_SCHEMA_1: SchemaType = {
    identifier: 'user',
    label: 'User',
    description: 'A user',
    pluralName: 'users',
    fields: {
        name: WORKING_FIELD_1,
    },
};
