// import { CTRL_SOCKET_NAME } from '!/control/domain';
// import useSocket from '#/useSocket';
import { ROUTES_PATH } from '!/routes/domain';
import { Accordion, Button } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import PageCenter from 'src/components/PageCenter';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Help');
const Help = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  // const { data } = useSocket<CTRL_SOCKET_NAME>('time');
  // const helpRef = useRef<HTMLElement>(null);
  /* ======   function    ====== */
  const handleReset = () => {
    localStorage.clear();
    location.reload();
    logger('handleReset');
  };
  /* ======   useEffect   ====== */
  return (
    <PageCenter title={t('도움말')}>
      <div className="relative">
        <i className="absolute -inset-14 -top-24" />
        <Accordion title={t('리셋 / 언어 설정 테스트')}>
          <p>
            {t('초기 언어 설정을 위해서는 초기화가 필요합니다. 브라우저의 언어를 변경 후 초기화 버튼을 눌러주세요.')}
          </p>
          <Button className="mt-4" onClick={handleReset}>
            {t('초기화')}
          </Button>
        </Accordion>
        <Accordion title={t('아이디가 없습니다')}>
          <Button onClick={() => (location.href = ROUTES_PATH['/sign-up'])}>{ROUTES_PATH['/sign-up']}</Button>
          <span className="ml-3">{t('회원가입을 진행해 주세요.')}</span>
        </Accordion>
        <Accordion title={t('통계 페이지의 검색기능')}>
          {t(
            '검색기능은 두가지가 있습니다. 필터는 현재 화면에 보여지는 데이터중 동일한 행만 남기는 기능으로, 화면에서 찾기 기능과 유사합니다. 검색 기능은 실제 DB에서 검색하는 기능입니다.',
          )}
        </Accordion>
      </div>
    </PageCenter>
    // <>
    //   {/* <Tutorial guide={[{ ref: helpRef, text: '도움말 페이지입니다. 미리 작성된 질문과 답변을 볼 수 있습니다.' }]} /> */}

    // </>
  );
};

export default Help;
