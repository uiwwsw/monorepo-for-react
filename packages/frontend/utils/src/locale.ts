export const getLang = () => {
  const locale = navigator.language;

  switch (locale) {
    default:
    case 'ko':
    case 'ko-KR':
      return 'ko';
    case 'en':
    case 'en-US':
      return 'en';
  }
};
