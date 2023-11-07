import { wait } from './wait';
import { createLogger } from './logger';
const logger = createLogger('@package-frontend/utils/fakeApi');
export const fakeApi = async <T>(res?: T) => {
  const random = Math.round(Math.random()) > 0;
  const time = 1000 * (Math.floor(Math.random() * 3) + 1);
  logger(random, time);
  await wait(time);
  if (!random) throw new Error('fakeApi 에러발생');
  if (res instanceof Array) return res.filter((_) => Math.round(Math.random()) > 0);
  return res;
};
