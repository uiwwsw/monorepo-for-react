import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { getLang } from './locale';
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.tz.guess();
export const FORMAT = (() => {
  switch (getLang()) {
    case 'ko':
      return 'YYYY년 MM월 DD일 HH:mm:ss';
    case 'en':
    case 'cn':
      return 'MMMM DD, YYYY HH:mm:ss';
  }
})();
export const FORMAT_WITHOUT_TIME = (() => {
  switch (getLang()) {
    case 'ko':
      return 'YYYY년 MM월 DD일';
    case 'en':
    case 'cn':
      return 'MMMM DD, YYYY';
  }
})();
export const newDate = (str?: string | Date | Dayjs | [value: number, unit?: dayjs.ManipulateType | undefined]) => {
  if (str === undefined) return dayjs();
  if (str instanceof Array) return dayjs().add(str[0], str[1]);
  return dayjs(`${str}`);
};
