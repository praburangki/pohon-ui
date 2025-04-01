export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never;

export type DynamicSlots<
  T extends { slot?: string },
  S extends string | undefined = undefined,
  D extends object = object,
> = {
  [
  K in T['slot'] as K extends string
    ? S extends string
      ? (K | `${K}-${S}`)
      : K
    : never
  ]?: (props: { item: Extract<T, { slot: K extends `${infer Base}-${S}` ? Base : K }> } & D) => any
};

export type PartialString<T> = {
  [K in keyof T]?: string
};
