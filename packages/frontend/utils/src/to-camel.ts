function isPascalOrSnakeCase(key: string): boolean {
  return /^[A-Z][a-zA-Z]*$/.test(key) || /_/.test(key);
}

export function toCamelCase(key: string): string {
  if (key.indexOf('_') > -1) {
    // Snake case to camel case
    return key.replace(/_./g, (match) => match.charAt(1).toUpperCase());
  } else {
    // Pascal case to camel case
    return key.charAt(0).toLowerCase() + key.slice(1);
  }
}
export function convertKeysToCamelCase<T>(obj: T): T {
  if (obj !== null && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(convertKeysToCamelCase) as T;
    } else {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = isPascalOrSnakeCase(key) ? toCamelCase(key) : key;
        (acc as any)[camelKey] = convertKeysToCamelCase((obj as any)[key]);
        return acc;
      }, {} as T);
    }
  }
  return obj;
}
