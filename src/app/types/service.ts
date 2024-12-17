type Res<T = void> = (T extends void ? void : { payload: T });
export type {Res}