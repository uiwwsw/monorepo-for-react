export const convertLang = (locale: string) => {
  switch (locale) {
    default:
    case 'ko':
    case 'ko-KR':
      return 'ko';
    case 'en':
    case 'en-US':
      return 'en';
    case 'cn':
    case 'zh-CN':
      return 'cn';
  }
};
export const getLang = () => convertLang(navigator.language);
