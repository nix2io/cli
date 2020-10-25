import { Schema } from "./classes";
import lexer from './lexer';

class SchemaNode {
    constructor(
        public identifier: string
    ) { }
}

class LinkNodes {
    constructor(
        public node: SchemaNode | LinkNodes | NodesList,
        public linkedNode: SchemaNode | LinkNodes | NodesList
    ) {}
}

class NodesList { 
    constructor(
        public nodes: SchemaNode[]
    ) {}
}

export const parseRelationString = (str: string) => {
    lexer(str);
}