import { convertAlarmToMessage } from '!/alarm/domain';
import useSocket from '#/useSocket';
import SocketDataContext from '@/SocketDataContext';
import { useEffect, useState } from 'react';
import Pages from 'src/Pages';
// import { createLogger } from '@package-frontend/utils';
import useToastsForAlarm from '#/useToastsForAlarm';
import { SOCKET_NAME } from '!/socket/domain';
import useSetting from '#/useSetting';
import { storage } from '#/storage';
import { STORAGE } from '!/storage/domain';
import { ModalWithPortal } from '@library-frontend/ui';
import { useTranslation } from 'react-i18next';
import { CHANGE_VERSION, getChangeVersion } from '!/version/domain';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('App');

const App = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const closeBtn = t('닫기');
  const resetBtn = t('리셋');
  const exVersion = storage.get(STORAGE.version);
  const [changeVersion, setChangeVersion] = useState(CHANGE_VERSION.SAME);
  const { alarmSound } = useSetting();
  const { tcmList, serverList, alarm, status } = useSocket(SOCKET_NAME.ZONE_GET_INFO);
  const { Toasts, showToast } = useToastsForAlarm();
  // const t = import.meta.env.VITE_APP
  /* ======   function    ====== */
  const handleClose = (e?: typeof closeBtn | typeof resetBtn) => {
    switch (e) {
      case resetBtn:
        storage.clear();
        storage.set(STORAGE.version, import.meta.env.PACKAGE_VERSION);
        location.reload();
        break;
      default:
      case closeBtn:
        storage.set(STORAGE.version, import.meta.env.PACKAGE_VERSION);
        break;
    }
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!exVersion) return storage.set(STORAGE.version, import.meta.env.PACKAGE_VERSION);

    const version = getChangeVersion();
    if (version === CHANGE_VERSION.SAME) return;

    setChangeVersion(version);
    // storage.set(STORAGE.version, import.meta.env.PACKAGE_VERSION);
    // storage.clear();
    // if ()
  }, []);
  useEffect(
    () =>
      alarm.forEach((x) => {
        const message = convertAlarmToMessage(x);
        if (!message) return;

        showToast({ message: `${alarmSound ? '🔔' : '🔕'} ${message}`, serialNo: x.serialNo });
      }),
    [alarm],
  );
  return (
    <>
      {Toasts}
      <ModalWithPortal persist hasButton={[closeBtn]} onClose={handleClose} open={changeVersion === CHANGE_VERSION.ETC}>
        <p className="whitespace-pre-line">
          {t('{{exVersion}}에서 {{version}} 버전으로 업데이트가 완료됐습니다.', {
            exVersion,
            version: import.meta.env.PACKAGE_VERSION,
          })}
        </p>
      </ModalWithPortal>
      <ModalWithPortal
        persist
        hasButton={[resetBtn, closeBtn]}
        onClose={handleClose}
        open={changeVersion === CHANGE_VERSION.MINOR}
      >
        <p className="whitespace-pre-line">
          {t('{{exVersion}}에서 {{version}} 버전으로 업데이트가 완료됐습니다.\n리셋을 권장합니다.', {
            exVersion,
            version: import.meta.env.PACKAGE_VERSION,
          })}
        </p>
      </ModalWithPortal>
      <ModalWithPortal
        persist
        hasButton={[resetBtn]}
        onClose={handleClose}
        open={changeVersion === CHANGE_VERSION.MAJOR}
      >
        <p className="whitespace-pre-line">
          {t(
            '{{exVersion}}에서 {{version}} 버전으로 업데이트가 완료됐습니다.\n많은 부분이 변경되어 리셋이 꼭 필요합니다.',
            {
              exVersion,
              version: import.meta.env.PACKAGE_VERSION,
            },
          )}
        </p>
      </ModalWithPortal>
      <SocketDataContext.Provider value={{ tcmList, serverList, alarm, status }}>
        <Pages />
      </SocketDataContext.Provider>
    </>
  );
};

export default App;
