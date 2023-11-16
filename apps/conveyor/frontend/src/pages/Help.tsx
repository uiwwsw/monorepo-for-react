import { Accordion, Button, ToastWithPortal, Tooltip } from '@library-frontend/ui';
import { LocalStorage, createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import PageCenter from 'src/components/PageCenter';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Help');
const Help = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  /* ======   function    ====== */
  const handleReset = () => {
    LocalStorage.clear();
    location.reload();
  };
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   trigger();
  // }, []);
  return (
    <PageCenter title={t('도움말')}>
      <Accordion title={t('리셋 / 언어 설정 테스트')}>
        {t('초기 언어 설정을 위해서는 초기화가 필요합니다. 브라우저의 언어를 변경 후 초기화 버튼을 눌러주세요.')}
        <br />
        <Button onClick={handleReset}>{t('초기화')}</Button>
      </Accordion>
      <Accordion title="아이디가 없습니다">
        <Button onClick={() => (location.href = '/sign-up')}>{t('/sign-up')}</Button> 페이지에 가서 회원가입을 진행해
        주세요.
      </Accordion>
    </PageCenter>
  );
};

export default Help;
