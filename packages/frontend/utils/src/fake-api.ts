import { wait } from './wait';
import { createLogger } from './logger';
import { LocalStorage } from '.';
const logger = createLogger('@package-frontend/utils/fakeApi');
const makeErrorBtn = () => {
  if (document.getElementById('test-btn')) return;
  const error = LocalStorage.get<number>('fake-error');
  const btn = document.createElement('button');
  btn.id = 'test-btn';
  btn.style.position = 'fixed';
  btn.style.right = '0';
  btn.style.top = '0';
  btn.style.background = 'red';
  btn.style.zIndex = '9999';
  btn.onclick = () => {
    let error = LocalStorage.get<number>('fake-error');
    if (!error) error = 0;
    else if (error >= 1) error = -0.1;
    error = Math.ceil((error + 0.1) * 10) / 10;
    LocalStorage.set('fake-error', error);
    btn.textContent = `에러 ${+error * 100}%`;
  };
  btn.textContent = `에러 ${+(error ?? 0) * 100}%`;
  document.body.appendChild(btn);
};
export const fakeApi = async <T>(res?: T): Promise<T | undefined> => {
  makeErrorBtn();
  const error = LocalStorage.get<number>('fake-error');
  const random = Math.random() > (error ?? 0);
  const time = 1000 * (Math.floor(Math.random() * 3) + 1);
  logger(`랜덤 성공실패:${random}. 타이머: ${time}`);
  if (!random) {
    console.error('fakeApi 에러발생');
    throw new Error('fakeApi 에러발생');
  }
  await wait(time);
  return res;
};
