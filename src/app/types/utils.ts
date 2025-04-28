type NonNullableKeys<T extends object> = { [P in keyof T]: NonNullable<T[P]> };
type KeysOfUnion<T> = T extends T ? keyof T : never;
type DeepPartial<T> = undefined | T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
type ArrayOfLength<T, L extends number> = T[] & { length: L };

export type { NonNullableKeys, KeysOfUnion, DeepPartial, ArrayOfLength };
