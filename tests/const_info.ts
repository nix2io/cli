import { InfoType } from '../src/types';
import { WORKING_AUTHOR_1 } from './const_author';


export const WORKING_INFO_1: InfoType = {
    identifier: "blog",
    label: "Blog",
    description: "The blog service",
    version: "1.0.0",
    authors: [
        WORKING_AUTHOR_1
    ],
    created: 1602604993,
    modified: 1602604993,
    license: "CC",
    termsOfServiceURL: "nix2.io/tos"
};

export const WORKING_INFO_2: InfoType = {
    identifier: "blog",
    label: null,
    description: null,
    version: '1.0.0',
    authors: [],
    created: 1602604993,
    modified: 1602604993,
    license: null,
    termsOfServiceURL: null
};

export const WORKING_INFO = [
    WORKING_INFO_1,
    WORKING_INFO_2
]