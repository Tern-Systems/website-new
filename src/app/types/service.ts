type Res<T = void, M extends boolean = true> = (T extends void
    ? { message: string }
    : M extends true
        ? { message: string, payload: T }
        : { payload: T });

export type {Res}
