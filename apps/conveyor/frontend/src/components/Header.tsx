import { createLogger } from '@package-frontend/utils';
import { useHeaderContext } from '@/HeaderContext';
import { Accordion, Button, ModalWithBtn } from '@library-frontend/ui';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetAuth } from '!/auth/application/get-auth';
import { useSocketDataContext } from '@/SocketDataContext';
import H3 from '@/Typography/H3';
import { convertAlarmToMessage } from '!/alarm/domain';
import { useRef, useState } from 'react';
import Empty from './Empty';
/* ======   interface   ====== */
export interface HeaderProps {}

/* ======    global     ====== */
const logger = createLogger('components/Header');
const Header = (_: HeaderProps) => {
  /* ======   variables   ====== */
  const btnRef = useRef<HTMLSpanElement>(null);
  const [tick, setClose] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useGetAuth();
  const { children } = useHeaderContext();
  const { alarm, clearAlarm } = useSocketDataContext();
  // "{\"CommandID\":\"N/A\",\"CarrierID\":\"N/A\",\"Time\":\"2024010414092554\",\"TaskID\":\"-1\",\"SerialNo\":\"2343\",\"EventCode\":\"31110\",\"Location\":\"106\",\"Reason\":\"0\",\"BaseTime\":\"2024010414092554\"}"
  // "[{\"CommandID\":\"N/A\",\"CarrierID\":\"N/A\",\"Time\":\"2024010414092554\",\"TaskID\":\"-1\",\"SerialNo\":\"2342\",\"EventCode\":\"24020\",\"Location\":\"106\",\"Reason\":\"0\",\"BaseTime\":\"2024010414092554\"}]"
  /* ======   function    ====== */
  const handleLogout = () => {
    navigate('/sign-out');
    logger('handleLogout');
  };
  /* ======   useEffect   ====== */
  return (
    <header className="sticky top-0 z-10 border-b bg-slate-100 gap-2">
      <div className="max-w-5xl flex items-center p-3 min-h-[5rem] m-auto sticky right-0">
        <div className="flex-auto">{children}</div>
        <div className="flex gap-2 items-center">
          <div>{data?.userName}</div>
          <ModalWithBtn
            hasCloseBtn
            closeTick={tick}
            button={
              <Button disabled={!alarm.length} themeColor={'tertiary'}>
                알람 {alarm.length}
              </Button>
            }
          >
            <div>
              <H3>
                <div className="flex justify-between gap-3">
                  이전 알람
                  <Button
                    themeSize={'sm'}
                    onClick={() => {
                      clearAlarm();
                      setClose(tick + 1);
                    }}
                  >
                    <span ref={btnRef}>전부 지우기</span>
                  </Button>
                </div>
              </H3>
              {alarm.length ? (
                alarm.map((x) => (
                  <Accordion key={x.serialNo} title={convertAlarmToMessage(x)}>
                    {Object.entries(x).map(([key, value]) => (
                      <div className="flex justify-between">
                        <span className="p-2">{key}:</span>
                        <span className="p-2">{value}</span>
                      </div>
                    ))}
                    <Button themeSize={'xs'} onClick={() => clearAlarm(x)}>
                      알람 지우기
                    </Button>
                  </Accordion>
                ))
              ) : (
                <Empty className="block py-10 m-auto w-fit" />
              )}
            </div>
          </ModalWithBtn>
          <Button smoothLoading themeColor={'secondary'} onClick={handleLogout}>
            {t('로그아웃')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
