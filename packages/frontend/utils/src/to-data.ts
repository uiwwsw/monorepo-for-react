import { FORMAT, newDate } from '.';

const isPascalOrSnakeCase = (key: string) => /^[A-Z][a-zA-Z]*$/.test(key) || /_/.test(key);
const isDateString = (s: string) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(s);

const toCamelCase = (key: string): string => {
  if (key.indexOf('_') > -1) {
    // Snake case to camel case
    return key.replace(/_./g, (match) => match.charAt(1).toUpperCase());
  } else {
    // Pascal case to camel case
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
};
export const toData = <T>(obj: T): T => {
  if (obj !== null && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(toData) as T;
    } else {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = isPascalOrSnakeCase(key) ? toCamelCase(key) : key;
        (acc as any)[camelKey] = toData((obj as any)[key]);
        return acc;
      }, {} as T);
    }
  }
  if (typeof obj === 'string' && isDateString(obj)) return newDate(obj).format(FORMAT) as T;
  return obj;
};
