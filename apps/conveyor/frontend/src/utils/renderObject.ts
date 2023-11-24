import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('utils/renderObject');
export const isDateString = (s: string) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(s);
const renderObject = <T>(props: T, key: keyof T) => {
  const data = props?.[key];
  logger(data);
  if (typeof data === 'number') return data;

  const strData = `${data}`;
  if (isDateString(strData)) return newDate(strData).format(FORMAT);
  return strData;
};

export default renderObject;
