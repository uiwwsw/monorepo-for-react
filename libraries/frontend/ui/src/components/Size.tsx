export const sizes = ['xl', 'md', 'sm', 'xs', null] as const;
export type Size = (typeof sizes)[number];
