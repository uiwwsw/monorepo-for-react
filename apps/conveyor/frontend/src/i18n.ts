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
      이름: 'Name',
      영어: 'English',
      중국어: 'Chinese',
      조작: 'Control',
      통계: 'Statistics',
      회원가입: 'Register',
      로그인: 'Login',
      도움말: 'Help',
      로그아웃: 'Logout',
      아이디: 'Username',
      비밀번호: 'Password',
      '비밀번호 확인': 'Confirm Password',
      새로고침: 'Refresh',
      // routes
      요약: 'Summary',
      알람: 'Alarm',
      케리어: 'Carrier',
      유저관리: 'Users',
      비밀번호변경: 'Update PW',
      //gram
      '10개씩 보기': '10 ',
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
      '이름을 입력해주세요.': 'Please enter your username.',
      '아이디를 입력해주세요.': 'Please enter your id.',
      '비밀번호를 입력해주세요.': 'Please enter your password.',
      '동일한 비밀번호를 한번 더 입력해주세요.': 'Please re-enter your password for confirmation.',
      '비밀번호가 일치하지 않아요.': 'Passwords do not match.',
      // sign in page
      '회원가입 하러가기': 'Register here',
      '로그아웃에 성공했습니다.': 'You have successfully logged out.',
      '로그인이 완료됐어요.\n확인을 누르면 메인 혹은 이전에 접근한 페이지로 이동합니다.':
        'Login successful.\nPress confirm to go to the main page\nor the last page you visited.',
      '방금 가입한 아이디로 로그인 해보세요~': 'Try logging in with the username you just registered.',
      //error page
      '해당 페이지에서는 페이지 새로 고침만 제공됩니다.': 'Only page refresh is available on this page.',
      '오류가 발생했어요': 'An error has occurred',
      '오류 코드 또는 오류 메세지': 'Error Code or Error Message',
      '메인으로 돌아가기': 'Return to Main',
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
      한글: '韩文',
      이름: '名字',
      영어: '英文',
      중국어: '中文',
      조작: '操作',
      통계: '统计',
      회원가입: '注册',
      로그인: '登录',
      도움말: '帮助',
      로그아웃: '登出',
      아이디: '用户名',
      비밀번호: '密码',
      '비밀번호 확인': '确认密码',
      새로고침: '刷新',
      // routes
      요약: '摘要',
      알람: '闹钟',
      케리어: '运营商',
      유저관리: '用户管理',
      비밀번호변경: '更新密码',
      //gram
      '기간을 선택해 주세요.': '请选择一个期间。',
      '날짜를 선택해 주세요.': '请选择日期。',
      '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.':
        '起始日期的时间00:00:00和结束日期的时间23:59:59将被省略。',
      //main page
      '컨베이어 for YMTC': '传送带为YMTC',
      '컨베이어 웹 서비스에 오신걸 환영합니다.': '欢迎来到传送带网络服务。',
      // sign up page
      '회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.': '注册完成。\n点击确认后将跳转到登录页面。',
      '이름을 입력해주세요.': '请输入您的名字。',
      '아이디를 입력해주세요.': '请输入您的用户名。',
      '비밀번호를 입력해주세요.': '请输入您的密码。',
      '동일한 비밀번호를 한번 더 입력해주세요.': '请再次输入相同的密码进行确认。',
      '비밀번호가 일치하지 않아요.': '密码不一致。',
      // sign in page
      '회원가입 하러가기': '去注册',
      '로그아웃에 성공했습니다.': '您已成功登出。',
      '로그인이 완료됐어요.\n확인을 누르면 메인 혹은 이전에 접근한 페이지로 이동합니다.':
        '登录成功。\n点击确认后将前往主页面或您之前访问的页面。',
      '방금 가입한 아이디로 로그인 해보세요~': '请尝试使用您刚注册的用户名登录。',
      //error page
      '해당 페이지에서는 페이지 새로 고침만 제공됩니다.': '该页面仅提供页面刷新。',
      '오류가 발생했어요': '发生错误',
      '오류 코드 또는 오류 메세지': '错误代码或错误消息',
      '메인으로 돌아가기': '返回主页',
      //not found page
      '페이지를 찾을 수 없어요.': '找不到页面。',
      '주소를 확인해주세요.': '请检查地址。',
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
