import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { getLang } from './locale';
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.tz.guess();
export const FORMAT = (() => {
  switch (getLang()) {
    case 'ko':
      return 'YYYY년 MM월 DD일 HH시 mm분 ss초';
    case 'en':
      return 'MMMM DD, YYYY HH:mm:ss';
  }
})();
export const newDate = (str?: unknown) => {
  if (str === undefined) return dayjs();
  if (str instanceof Array) return dayjs().add(str[0], str[1]);
  return dayjs(`${str}`);
};
