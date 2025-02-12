type NonNullableKeys<T extends object> = { [P in keyof T]: NonNullable<T[P]> };
type KeysOfUnion<T> = T extends T ? keyof T : never;

export type { NonNullableKeys, KeysOfUnion };
