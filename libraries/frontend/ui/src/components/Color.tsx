export const colors = ['primary', 'secondary', 'tertiary', 'quaternary', null] as const;
export type Color = (typeof colors)[number];
