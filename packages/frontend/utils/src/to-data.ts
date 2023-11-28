const handleFixedWords = (str: string): string => {
  ['ID', 'TCM'].forEach((word) => {
    const regExp = new RegExp(word, 'g'); // Use word boundary to match whole words
    str = str.replace(regExp, (match, offset) => {
      // Convert to lowercase, but if it's not at the start of the string, capitalize the first letter
      return offset === 0 ? match.toLowerCase() : match.charAt(0).toUpperCase() + match.substring(1).toLowerCase();
    });
  });
  return str;
};
const isPascalOrSnakeCase = (key: string) => /^[A-Z][a-zA-Z]*$/.test(key) || /_/.test(key);

const toCamelCase = (key: string): string => {
  key = handleFixedWords(key);
  if (key.indexOf('_') > -1) {
    // Snake case to camel case
    return key.replace(/_./g, (match) => match.charAt(1).toUpperCase());
  } else {
    // Pascal case to camel case
    return key.charAt(0).toLowerCase() + key.slice(1);
    // // Function to handle consecutive uppercase letters
    // const replaceUpperCase = (match: string, offset: number, fullString: string): string => {
    //   // Check if the match is at the end of the string or followed by a lowercase letter'
    //   if (offset + match.length === fullString.length) {
    //     return match.slice(0, 1) + match.slice(-match.length + 1).toLowerCase();
    //   } else {
    //     return (
    //       match.slice(0, 1).toUpperCase() +
    //       match.slice(1, match.length - 1).toLowerCase() +
    //       match.slice(-1).toUpperCase()
    //     );
    //   }
    // };

    // // Convert Pascal case to camel case, with special handling for consecutive uppercase characters
    // return key.charAt(0).toLowerCase() + key.slice(1).replace(/[A-Z]{2,}/g, replaceUpperCase);
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
  return obj;
};
