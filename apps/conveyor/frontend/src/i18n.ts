import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ko: {
    translation: {
      USER_NOT_FOUND: '아이디를 찾을 수 없습니다.',
      PASSWORD_NOT_MATCH: '비밀번호가 틀렸습니다.',
      USER_NOT_AUTHORIZED: '계정이 인증되지 않았습니다.',
      ALREADY_EXISTED_USER_ID: '이미 동일한 아이디가 존재합니다.',
    },
  },
  en: {
    translation: {
      설정: 'Settings',
      '데이터가 없습니다.': 'EMPTY',
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
      서머리: 'Summary',
      알람: 'Alarm',
      케리어: 'Carrier',
      유저관리: 'User Management',
      비밀번호변경: 'Change Password',
      '10개씩 보기': 'View 10 per page',
      '기간을 선택해 주세요.': 'Please select a period.',
      '날짜를 선택해 주세요.': 'Please select a date.',
      '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.':
        'The time 00:00:00 for the start date and 23:59:59 for the end date will be omitted.',
      '컨베이어 for YMTC': 'Conveyor for YMTC',
      '컨베이어 웹 서비스에 오신걸 환영합니다.': 'Welcome to the Conveyor Web Service.',
      '회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.':
        'Registration complete.\nPress confirm to proceed to the login page.',
      '이름을 입력해주세요.': 'Please enter your name.',
      '아이디를 입력해주세요.': 'Please enter your ID.',
      '비밀번호를 입력해주세요.': 'Please enter your password.',
      '동일한 비밀번호를 한번 더 입력해주세요.': 'Please re-enter the same password for confirmation.',
      '비밀번호가 일치하지 않아요.': 'Passwords do not match.',
      ALREADY_EXISTED_USER_ID: 'The same user ID already exists.',
      USER_NOT_FOUND: 'User ID not found.',
      PASSWORD_NOT_MATCH: 'Incorrect password.',
      USER_NOT_AUTHORIZED: 'Account not verified.',
      '회원가입 하러가기': 'Go to register',
      '로그아웃에 성공했습니다.': 'You have successfully logged out.',
      '로그인이 완료됐어요.': 'Login successful.\nPress confirm to go to the main page or the last page you visited.',
      '방금 가입한 아이디로 로그인 해보세요~': 'Try logging in with the newly registered ID.',
      '로그인 정보가 없어요. 로그인 완료 후 이전 페이지로 이동합니다.':
        'No login information available. Will redirect to the previous page after login.',
      '세선이 만료됐습니다.': 'Session expired.',
      '비밀번호가 변경됐어요. 변경된 비밀번호로 로그인해보세요.':
        'Password changed. Please login with the new password.',
      '이전 페이지로 이동하기': 'Go to previous page',
      '조작 페이지로 이동하기': 'Go to control page',
      '로그아웃 성공했습니다.': 'Logout successful.',
      '로그아웃에 실패했습니다.': 'Logout failed.',
      '해당 페이지에서는 페이지 새로 고침만 제공됩니다.': 'Only page refresh is available on this page.',
      '오류가 발생했어요': 'An error has occurred',
      '오류 코드 또는 오류 메세지': 'Error Code or Error Message',
      '메인으로 돌아가기': 'Return to Main',
      '페이지를 찾을 수 없어요.': 'Page not found.',
      '주소를 확인해주세요.': 'Please check the URL.',
      '기본 테이블 갯수': 'Default Table Count',
      '기본 달력 기간': 'Default Calendar Period',
      '로그 뷰어 새창': 'Log Viewer New Window',
      '파일이 없어요': 'No file found',
      '선택된 행이 없습니다.': 'No row selected.',
      '{{id}} 외 {{length}}개': '{{id}} and {{length}} more',
      '존 아이디': 'Zone ID',
      '케리어 토탈': 'Total Carriers',
      '케리어 평균': 'Average Carriers',
      '알람 토탈': 'Total Alarms',
      '알람 평균': 'Average Alarms',
      '{{id}} 유저의 등급을 {{grade}} 등급으로 바꿨습니다': 'Changed the grade of user {{id}} to grade {{grade}}',
      '언어를 선택해 주세요.': 'Please select a language.',
      '검색 결과가 없습니다.': 'No search results.',
      '로그인에 실패했습니다.': 'Login failed.',
      '토스트 팝업입니다.\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.':
        'This is a toast popup.\nFeedback on user events helps in understanding the service.',
      '변경에 성공했습니다.': 'Change successful.',
      '페이지{{limit}}를 벗어나는 수{{newValue}}는 입력할 수 없습니다.':
        'Cannot enter a number {{newValue}} that exceeds page {{limit}}.',
    },
  },
  'zh-CN': {
    translation: {
      설정: '设置',
      '데이터가 없습니다.': '空',
      한글: '韩文',
      이름: '姓名',
      영어: '英语',
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
      서머리: '概要',
      알람: '警报',
      케리어: '运营商',
      유저관리: '用户管理',
      비밀번호변경: '更改密码',
      '10개씩 보기': '每页显示10个',
      '기간을 선택해 주세요.': '请选择期间。',
      '날짜를 선택해 주세요.': '请选择日期。',
      '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.':
        '开始日期的时间00:00:00和结束日期的时间23:59:59将被省略。',
      '컨베이어 for YMTC': '传送带为YMTC',
      '컨베이어 웹 서비스에 오신걸 환영합니다.': '欢迎来到传送带网络服务。',
      '회원가입이 완료됐어요.\n확인을 누르면 로그인 페이지로 이동합니다.': '注册已完成。\n点击确认后将转到登录页面。',
      '이름을 입력해주세요.': '请输入您的姓名。',
      '아이디를 입력해주세요.': '请输入您的ID。',
      '비밀번호를 입력해주세요.': '请输入您的密码。',
      '동일한 비밀번호를 한번 더 입력해주세요.': '请再次输入相同的密码进行确认。',
      '비밀번호가 일치하지 않아요.': '密码不匹配。',
      ALREADY_EXISTED_USER_ID: '已存在相同的用户ID。',
      USER_NOT_FOUND: '找不到用户ID。',
      PASSWORD_NOT_MATCH: '密码错误。',
      USER_NOT_AUTHORIZED: '账户未验证。',
      '회원가입 하러가기': '去注册',
      '로그아웃에 성공했습니다.': '您已成功登出。',
      '로그인이 완료됐어요.': '登录成功。\n点击确认后将转到主页面或您最后访问的页面。',
      '방금 가입한 아이디로 로그인 해보세요~': '尝试使用您刚注册的ID登录。',
      '로그인 정보가 없어요. 로그인 완료 후 이전 페이지로 이동합니다.': '没有登录信息。登录完成后将跳转到前一个页面。',
      '세선이 만료됐습니다.': '会话已过期。',
      '비밀번호가 변경됐어요. 변경된 비밀번호로 로그인해보세요.': '密码已更改。请使用新密码登录。',
      '이전 페이지로 이동하기': '转到前一个页面',
      '조작 페이지로 이동하기': '转到操作页面',
      '로그아웃 성공했습니다.': '登出成功。',
      '로그아웃에 실패했습니다.': '登出失败。',
      '해당 페이지에서는 페이지 새로 고침만 제공됩니다.': '此页面仅提供页面刷新。',
      '오류가 발생했어요': '发生错误',
      '오류 코드 또는 오류 메세지': '错误代码或错误消息',
      '메인으로 돌아가기': '返回主页',
      '페이지를 찾을 수 없어요.': '找不到页面。',
      '주소를 확인해주세요.': '请检查网址。',
      '기본 테이블 갯수': '默认表格数量',
      '기본 달력 기간': '默认日历期间',
      '로그 뷰어 새창': '日志查看器新窗口',
      '파일이 없어요': '没有文件',
      '선택된 행이 없습니다.': '未选择任何行。',
      '{{id}} 외 {{length}}개': '{{id}}和其他{{length}}个',
      '존 아이디': '区域ID',
      '케리어 토탈': '运营商总数',
      '케리어 평균': '运营商平均数',
      '알람 토탈': '警报总数',
      '알람 평균': '警报平均数',
      '{{id}} 유저의 등급을 {{grade}} 등급으로 바꿨습니다': '已将用户{{id}}的等级更改为{{grade}}等级',
      '언어를 선택해 주세요.': '请选择语言。',
      '검색 결과가 없습니다.': '没有搜索结果。',
      '로그인에 실패했습니다.': '登录失败。',
      '토스트 팝업입니다.\n유저의 이벤트에 피드백을 주어 서비스를 이해하는데 도움이 됩니다.':
        '这是一个弹出提示。\n对用户事件的反馈有助于理解服务。',
      '변경에 성공했습니다.': '更改成功。',
      '페이지{{limit}}를 벗어나는 수{{newValue}}는 입력할 수 없습니다.':
        '无法输入超出页面{{limit}}的数字{{newValue}}。',
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
