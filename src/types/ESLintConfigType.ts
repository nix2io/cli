import { Obj } from './ObjectType';

enum Rules {
    off = 0,
    warn = 1,
    error = 2,
}

type ESLintRule = Rules | [Rules, Obj];

export default interface ESLintConfigType {
    env?: {
        node?: boolean;
        es6?: boolean;
    };
    extends?: string[];
    parser?: string;
    parserOptions?: {
        ecmaVersion: number;
        sourceType: string;
    };
    plugins?: string[];
    rules?: Record<string, ESLintRule>;
}
