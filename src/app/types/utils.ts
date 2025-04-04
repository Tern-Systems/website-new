type NonNullableKeys<T extends object> = { [P in keyof T]: NonNullable<T[P]> };
type KeysOfUnion<T> = T extends T ? keyof T : never;
type DeepPartial<T> = undefined | T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export type { NonNullableKeys, KeysOfUnion, DeepPartial };
