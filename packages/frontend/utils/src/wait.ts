export const wait = async <T>(time: number = 500) =>
  await new Promise((res: (value: T) => unknown) => setTimeout(res, time));
