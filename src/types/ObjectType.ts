export type Primative<T = null> =
    | T
    | string
    | number
    | boolean
    | null
    | Set<string>
    | Func;

export type Obj = {
    [name: string]: Primative<Obj> | Primative<Obj>[];
};

export type Any = Obj | Primative | Any[];

export type Func = (...args: Any[]) => Any;
