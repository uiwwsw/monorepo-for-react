import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      //word
      한글: 'Korean',
      영어: 'English',
      중국어: 'Chinese',
      통계: 'Statistics',
      회원가입: 'Register',
      로그인: 'Login',
      도움말: 'Help',
      로그아웃: 'Logout',
      아이디: 'Username',
      비밀번호: 'Password',
      '비밀번호 확인': 'Confirm Password',
      //gram
      '기간을 선택해 주세요.': 'Please select a date range.',
      '날짜를 선택해 주세요.': 'Please select a duration.',
      '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.':
        'The time of 00:00:00 on the start date and 23:59:59 on the end date will be omitted.',
      //main page
      '컨베이어 for YMTC': 'Conveyor for YMTC',
      '컨베이어 웹 서비스에 오신걸 환영합니다.': 'Welcome to the Conveyor Web Service.',
      // sign up page
      '회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.':
        'Registration complete.\nPress confirm to proceed to the login page.',
      '아이디를 입력해주세요.': 'Please enter your username.',
      '비밀번호를 입력해주세요.': 'Please enter your password.',
      '동일한 비밀번호를 한번 더 입력해주세요.': 'Please re-enter your password for confirmation.',
      '비밀번호가 일치하지 않아요.': 'Passwords do not match.',
      // sign in page
      '회원가입 하러가기': 'Register here',
      '로그아웃에 성공했습니다.': 'You have successfully logged out.',
      '로그인이 완료됐어요.\n확인을 누르면 메인 혹은 이전에 접근한 페이지로 이동합니다.':
        'Login successful.\nPress confirm to go to the main page\nor the last page you visited.',
      '방금 가입한 아이디로 로그인 해보세요~': 'Try logging in with the username you just registered.',
      //not found page
      '페이지를 찾을 수 없어요.': 'Page not found.',
      '주소를 확인해주세요.': 'Please check the URL.',
      // toast
      '로그인에 실패했습니다.': 'Login failed.',
      // modal
    },
  },
  'zh-CN': {
    translation: {
      //word
      한글: '韩国人',
      영어: '英语',
      중국어: '中国人',
      조작: '控制',
      통계: '统计',
      회원가입: '注册',
      로그인: '登录',
      도움말: '帮助',
      로그아웃: '登出',
      아이디: '用户名',
      비밀번호: '密码',
      '비밀번호 확인': '确认密码',

      //gram
      '기간을 선택해 주세요.': '请选择日期范围。',
      '날짜를 선택해 주세요.': '请选择日期。',
      '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.':
        '起始日期的00:00:00和结束日期的23:59:59将被省略。',

      //main page
      '컨베이어 for YMTC': 'YMTC 传送带',
      '컨베이어 웹 서비스에 오신걸 환영합니다.': '欢迎来到传送带网络服务。',
      // sign up page
      '회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.': '注册完成。\n按确认继续前往登录页面。',
      '아이디를 입력해주세요.': '请输入用户名。',
      '비밀번호를 입력해주세요.': '请输入密码。',
      '동일한 비밀번호를 한번 더 입력해주세요.': '请再次输入密码进行确认。',
      '비밀번호가 일치하지 않아요.': '密码不一致。',
      // sign in page
      '회원가입 하러가기': '去这里注册',
      '로그아웃에 성공했습니다.': '您已成功登出。',
      '로그인이 완료됐어요.\n확인을 누르면 메인 혹은 이전에 접근한 페이지로 이동합니다.':
        '登录成功。\n按确认前往主页面或您上次访问的页面。',
      '방금 가입한 아이디로 로그인 해보세요~': '请尝试使用您刚注册的用户名登录。',
      //not found page
      '페이지를 찾을 수 없어요.': '找不到页面。',
      '주소를 확인해주세요.': '请检查网址。',
      // toast
      '로그인에 실패했습니다.': '登录失败。',
      // modal
    },
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
