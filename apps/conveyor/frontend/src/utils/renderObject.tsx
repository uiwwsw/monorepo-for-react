import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('utils/renderObject');
const isDateString = (s: string) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(s);
const renderObject = <T,>(props: T, key: keyof T) => {
  logger(props, key);
  const data = `${props?.[key] ?? ''}`;
  logger(data);
  if (isDateString(data)) return newDate(data).format(FORMAT);
  return data;
};

export default renderObject;
