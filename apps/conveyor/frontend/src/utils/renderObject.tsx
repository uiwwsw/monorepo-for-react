import Empty from '@/Empty';
import { Spinner } from '@library-frontend/ui';
import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('utils/renderObject');
export const isDateString = (s: string) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(s);
const renderObject = <T,>(props: T, ...key: (keyof T)[]) => {
  // const data = props?.[key];
  if (!props) return <Spinner />;
  const data = key.reduce((a: any, v) => {
    const t = a?.[v];
    if (t) return t as T;
    return undefined;
  }, props);
  logger(data);
  if (!data) return <Empty />;

  if (typeof data === 'number') {
    logger(data);
    return data;
  }

  const strData = `${data}`;
  if (isDateString(strData)) {
    logger(strData);
    return newDate(strData).format(FORMAT);
  }
  return data ?? <span>{strData}</span>;
};

export default renderObject;
