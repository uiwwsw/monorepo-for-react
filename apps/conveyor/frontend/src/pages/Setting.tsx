// import { CTRL_SOCKET_NAME } from '!/control/domain';
// import useSocket from '#/useSocket';
import { STORAGE } from '!/storage/domain';
import { pageSizeOptions } from '#/constants';
import { storage } from '#/storage';
import { useToasts, RadioGroup, Select, Checkbox } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PageCenter from '@/PageCenter';
import useSetting from '#/useSetting';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Setting');
const Setting = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { defaultPageSize, defaultDuration, defaultViewBrowser } = useSetting();

  const { Toasts, showToast } = useToasts();
  /* ======   function    ====== */
  const handleChangePageSize = (e: ChangeEvent<HTMLInputElement>) => {
    storage.set(STORAGE['setting/default-page-size'], e.target.value);
    showToast({ message: t('변경에 성공했습니다.'), type: 'success' });
    logger('handleChangePageSize', e);
  };
  const handleChangeDuration = (e: ChangeEvent<HTMLSelectElement>) => {
    storage.set(STORAGE['setting/default-duration'], +e.target.value);
    showToast({ message: t('변경에 성공했습니다.'), type: 'success' });
    logger('handleChangeDuration', e);
  };
  const handleChangeBrowser = (e: ChangeEvent<HTMLInputElement>) => {
    storage.set(STORAGE['setting/default-view-browser'], e.target.checked);
    showToast({ message: t('변경에 성공했습니다.'), type: 'success' });
    logger('handleChangeBrowser', e);
  };
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <PageCenter title={t('설정')} icon="⚙️">
        <div className="flex items-center">
          <span className="text-lg">{t('기본 테이블 갯수')}</span>:
          <div className="ml-3">
            <RadioGroup
              defaultValue={`${defaultPageSize}`}
              onChange={handleChangePageSize}
              labels={pageSizeOptions.map((x) => x.value)}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-lg">{t('기본 달력 기간')}</span>:
          <div className="ml-3">
            <Select
              defaultValue={`${defaultDuration}`}
              options={[
                {
                  value: '7',
                  label: t('7일'),
                },
                {
                  value: '14',
                  label: t('14일'),
                },
                {
                  value: '21',
                  label: t('21일'),
                },
                {
                  value: '28',
                  label: t('28일'),
                },
                {
                  value: '35',
                  label: t('35일'),
                },
                {
                  value: '42',
                  label: t('42일'),
                },
                {
                  value: '49',
                  label: t('49일'),
                },
                {
                  value: '56',
                  label: t('56일'),
                },
                {
                  value: '60',
                  label: t('60일'),
                },
              ]}
              onChange={handleChangeDuration}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-lg">{t('로그 뷰어 새창')}</span>:
          <div className="ml-3">
            <Checkbox onChange={handleChangeBrowser} checked={defaultViewBrowser} />
          </div>
        </div>
      </PageCenter>
    </>
  );
};

export default Setting;
