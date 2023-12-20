export const deleteUndefined = <T,>(data: unknown): T => {
  if (data instanceof Array) return data.map((x) => deleteUndefined(x)) as T;
  if (data instanceof Object)
    return Object.entries(data).reduce(
      (a, [key, value]) => ({
        ...a,
        [key]: value ?? '',
      }),
      {},
    ) as T;
  return data as T;
};
