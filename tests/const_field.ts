import { FieldType } from '../src/types';

export const WORKING_FIELD_1: FieldType = {
    label: 'Name',
    description: 'The name of the user',
    type: 'string',
    required: true,
    default: null,
    flags: ['personal'],
};
