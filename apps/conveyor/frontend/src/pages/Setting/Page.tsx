// import { CTRL_SOCKET_NAME } from '!/control/domain';
// import useSocket from '#/useSocket';
import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import { useToasts } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import PageCenter from '@/PageCenter';
import useSetting from '#/useSetting';
import H2 from '@/Typography/H2';
import H3 from '@/Typography/H3';
import SettingPagination from './Pagination';
import SettingDuration from './Duration';
import SettingCheckbox from './Checkbox';
import { theadAlarm, mustHaveColumnAlarm } from '../Stats/Alarm/Page';
import { theadCarrier, mustHaveColumnCarrier } from '../Stats/Carrier/Page';
import SettingCheckGroup from './CheckboxGroup';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Setting');
const Setting = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    pageSize,
    duration,
    viewBrowser,
    controlPagination,
    alarmSound,
    pageSizeForTcmSetting,
    pageSizeForSummarySetting,
    pageSizeForAlarmSetting,
    pageSizeForCarrierSetting,
    pageSizeForUsersSetting,
    durationForAlarmSetting,
    durationForCarrierSetting,
    durationForSummarySetting,
    columnForAlarm,
    columnForCarrier,
  } = useSetting();

  const { Toasts, showToast } = useToasts();
  /* ======   function    ====== */
  const handleChange = (key: STORAGE, value: unknown) => {
    storage.set(key, value);
    showToast({ message: t('변경에 성공했습니다.'), type: 'success' });
    logger(key, value);
  };

  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <PageCenter title={t('설정')} icon="⚙️">
        <H2>{t('기본')}</H2>
        <SettingPagination
          label={t('기본 페이지당 리스트 수')}
          value={pageSize}
          onChange={(e) => handleChange(STORAGE['setting/page-size'], e.target.value)}
        />
        <SettingDuration
          label={t('기본 달력 기간')}
          value={duration}
          onChange={(e) => handleChange(STORAGE['setting/duration'], e.target.value)}
        />
        <SettingCheckbox
          label={t('알람 소리')}
          checked={alarmSound}
          onChange={(e) => handleChange(STORAGE['setting/alarm-sound'], e.target.checked)}
        />
        <H2>{t('조작')}</H2>
        <SettingCheckbox
          label={t('조작 테이블 페이지네이션 적용')}
          checked={controlPagination}
          onChange={(e) => handleChange(STORAGE['setting/control-pagination'], e.target.checked)}
        />
        {controlPagination && (
          <SettingCheckbox
            label={t('TCM 페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForTcmSetting}
            onChange={() =>
              handleChange(STORAGE['setting/control/tcm/page-size'], pageSizeForTcmSetting ? '' : pageSize)
            }
          />
        )}
        {!!pageSizeForTcmSetting && (
          <SettingPagination
            label={t('TCM 페이지당 리스트 수')}
            value={pageSizeForTcmSetting}
            onChange={(e) => handleChange(STORAGE['setting/control/tcm/page-size'], e.target.value)}
          />
        )}
        <H2>{t('통계')}</H2>
        <SettingCheckbox
          label={t('로그 뷰어 새창')}
          checked={viewBrowser}
          onChange={(e) => handleChange(STORAGE['setting/view-browser'], e.target.checked)}
        />
        <H3>{t('요약')}</H3>
        <SettingCheckbox
          label={t('요약 페이지당 리스트 수 커스텀')}
          checked={!!pageSizeForSummarySetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/summary/page-size'], pageSizeForSummarySetting ? '' : pageSize)
          }
        />
        {!!pageSizeForSummarySetting && (
          <SettingPagination
            label={t('요약 페이지당 리스트 수')}
            value={pageSizeForSummarySetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/summary/page-size'], e.target.value)}
          />
        )}
        <SettingCheckbox
          label={t('요약 달력 기간 커스텀')}
          checked={!!durationForSummarySetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/summary/duration'], durationForSummarySetting ? '' : duration)
          }
        />
        {!!durationForSummarySetting && (
          <SettingDuration
            label={t('요약 달력 기간')}
            value={durationForSummarySetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/summary/duration'], e.target.value)}
          />
        )}

        <H3>{t('알람')}</H3>
        <SettingCheckbox
          label={t('알람 페이지당 리스트 수 커스텀')}
          checked={!!pageSizeForAlarmSetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/alarm/page-size'], pageSizeForAlarmSetting ? '' : pageSize)
          }
        />
        {!!pageSizeForAlarmSetting && (
          <SettingPagination
            label={t('알람 페이지당 리스트 수')}
            value={pageSizeForAlarmSetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/alarm/page-size'], e.target.value)}
          />
        )}
        <SettingCheckbox
          label={t('알람 달력 기간 커스텀')}
          checked={!!durationForAlarmSetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/alarm/duration'], durationForAlarmSetting ? '' : duration)
          }
        />
        {!!durationForAlarmSetting && (
          <SettingDuration
            label={t('알람 달력 기간')}
            value={durationForAlarmSetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/alarm/duration'], e.target.value)}
          />
        )}
        <SettingCheckGroup
          label={t('알람 테이블 헤더')}
          labels={[...theadAlarm]}
          defaultChecks={columnForAlarm}
          disabled={mustHaveColumnAlarm.reduce((a, v) => ({ ...a, [v]: true }), {})}
          onChange={(e) => handleChange(STORAGE['setting/stats/alarm/column'], e)}
        />
        <H3>{t('케리어')}</H3>
        <SettingCheckbox
          label={t('케리어 페이지당 리스트 수 커스텀')}
          checked={!!pageSizeForCarrierSetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/carrier/page-size'], pageSizeForCarrierSetting ? '' : pageSize)
          }
        />
        {!!pageSizeForCarrierSetting && (
          <SettingPagination
            label={t('케리어 페이지당 리스트 수')}
            value={pageSizeForCarrierSetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/carrier/page-size'], e.target.value)}
          />
        )}
        <SettingCheckbox
          label={t('케리어 달력 기간 커스텀')}
          checked={!!durationForCarrierSetting}
          onChange={() =>
            handleChange(STORAGE['setting/stats/carrier/duration'], durationForCarrierSetting ? '' : duration)
          }
        />
        {!!durationForCarrierSetting && (
          <SettingDuration
            label={t('케리어 달력 기간')}
            value={durationForCarrierSetting}
            onChange={(e) => handleChange(STORAGE['setting/stats/carrier/duration'], e.target.value)}
          />
        )}
        <SettingCheckGroup
          label={t('케리어 테이블 헤더')}
          labels={[...theadCarrier]}
          defaultChecks={columnForCarrier}
          disabled={mustHaveColumnCarrier.reduce((a, v) => ({ ...a, [v]: true }), {})}
          onChange={(e) => handleChange(STORAGE['setting/stats/carrier/column'], e)}
        />
        <H2>{t('유저관리')}</H2>
        <SettingCheckbox
          label={t('유저관리 페이지당 리스트 수 커스텀')}
          checked={!!pageSizeForUsersSetting}
          onChange={() => handleChange(STORAGE['setting/users/page-size'], pageSizeForUsersSetting ? '' : pageSize)}
        />
        {!!pageSizeForUsersSetting && (
          <SettingPagination
            label={t('유저관리 페이지당 리스트 수')}
            value={pageSizeForUsersSetting}
            onChange={(e) => handleChange(STORAGE['setting/users/page-size'], e.target.value)}
          />
        )}
      </PageCenter>
    </>
  );
};

export default Setting;
