import { Method } from '.';

type methods = "get"|"post"|"head"|"delete"|"put"|"patch"|"options";


export default class Path {
    constructor(
        public path: string,
        public methods: {[key in methods]: Method}
    ) {}

    static deserialize(path: string, methods: {[key: string]: any}) {
        return new Path(
            path,
            Object.assign({}, ...Object.keys(methods).map(k => ({[k]: Method.deserialize(k, methods[k])})))
        );
    }

    serialize() {
        // @ts-ignore  WHAT THE HELL
        return Object.assign({}, ...Object.keys(this.methods).map((k: string) => ({[k]: this.methods[k].serialize()})))
    }
}