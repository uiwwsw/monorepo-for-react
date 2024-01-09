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
import SettingCheckGroup from './CheckboxGroup';
import {
  columnAlarmDisabled,
  columnWarningDisabled,
  columnCarrierDisabled,
  columnSummaryDisabled,
  fixHeadAlarm,
  fixHeadCarrier,
  fixHeadSummary,
  fixHeadWarning,
  theadAlarm,
  theadCarrier,
  theadSummary,
  theadWarning,
} from '!/stats/domain';
import { columnUsersDisabled, fixHeadUsers, theadUsers } from '!/auth/domain';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Setting');
const Setting = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    pageSize,
    duration,
    logBrowser,
    logBrowserMultiple,
    controlPagination,
    alarmSound,
    pageSizeForTcmSetting,
    pageSizeForSummarySetting,
    pageSizeForAlarmSetting,
    pageSizeForWarningSetting,
    pageSizeForCarrierSetting,
    pageSizeForUsersSetting,
    durationForAlarmSetting,
    durationForWarningSetting,
    durationForCarrierSetting,
    durationForSummarySetting,
    columnForSummary,
    columnForAlarm,
    columnForWarning,
    columnForCarrier,
    columnForUsers,
    tableFilterWarning,
    tableFilterAlarm,
    tableFilterCarrier,
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
          label={t('테이블 페이지네이션 적용')}
          checked={controlPagination}
          onChange={(e) => handleChange(STORAGE['setting/control-pagination'], e.target.checked)}
        />
        {controlPagination && (
          <SettingCheckbox
            label={t('페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForTcmSetting}
            onChange={() =>
              handleChange(STORAGE['setting/control/tcm/page-size'], pageSizeForTcmSetting ? '' : pageSize)
            }
          />
        )}
        {!!pageSizeForTcmSetting && (
          <SettingPagination
            label={t('페이지당 리스트 수')}
            value={pageSizeForTcmSetting}
            onChange={(e) => handleChange(STORAGE['setting/control/tcm/page-size'], e.target.value)}
          />
        )}
        <H2>{t('통계')}</H2>

        <SettingCheckbox
          label={t('로그 뷰어 새창')}
          checked={logBrowser}
          onChange={(e) => handleChange(STORAGE['setting/log-browser'], e.target.checked)}
        />
        {logBrowser && (
          <SettingCheckbox
            label={t('로그 별로 새로운 창 띄움')}
            checked={logBrowserMultiple}
            onChange={(e) => handleChange(STORAGE['setting/log-browser-multiple'], e.target.checked)}
          />
        )}
        <div className="pl-2">
          <H3>{t('요약')}</H3>
          <SettingCheckbox
            label={t('페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForSummarySetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/summary/page-size'], pageSizeForSummarySetting ? '' : pageSize)
            }
          />
          {!!pageSizeForSummarySetting && (
            <SettingPagination
              label={t('페이지당 리스트 수')}
              value={pageSizeForSummarySetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/summary/page-size'], e.target.value)}
            />
          )}
          <SettingCheckbox
            label={t('달력 기간 커스텀')}
            checked={!!durationForSummarySetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/summary/duration'], durationForSummarySetting ? '' : duration)
            }
          />
          {!!durationForSummarySetting && (
            <SettingDuration
              label={t('달력 기간')}
              value={durationForSummarySetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/summary/duration'], e.target.value)}
            />
          )}
          <SettingCheckGroup
            label={t('테이블 헤더')}
            labels={theadSummary}
            fixHead={fixHeadSummary}
            disabled={columnSummaryDisabled}
            defaultChecks={columnForSummary}
            onChange={(e) => handleChange(STORAGE['setting/stats/summary/column'], e)}
          />
        </div>
        <div className="pl-2">
          <H3>{t('알람')}</H3>
          <SettingCheckbox
            label={t('테이블 필터기능')}
            checked={tableFilterAlarm}
            onChange={(e) => handleChange(STORAGE['setting/stats/alarm/table/filter'], e.target.checked)}
          />
          <SettingCheckbox
            label={t('페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForAlarmSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/alarm/page-size'], pageSizeForAlarmSetting ? '' : pageSize)
            }
          />
          {!!pageSizeForAlarmSetting && (
            <SettingPagination
              label={t('페이지당 리스트 수')}
              value={pageSizeForAlarmSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/alarm/page-size'], e.target.value)}
            />
          )}
          <SettingCheckbox
            label={t('달력 기간 커스텀')}
            checked={!!durationForAlarmSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/alarm/duration'], durationForAlarmSetting ? '' : duration)
            }
          />
          {!!durationForAlarmSetting && (
            <SettingDuration
              label={t('달력 기간')}
              value={durationForAlarmSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/alarm/duration'], e.target.value)}
            />
          )}
          <SettingCheckGroup
            label={t('테이블 헤더')}
            labels={theadAlarm}
            fixHead={fixHeadAlarm}
            defaultChecks={columnForAlarm}
            disabled={columnAlarmDisabled}
            onChange={(e) => handleChange(STORAGE['setting/stats/alarm/column'], e)}
          />
        </div>
        <div className="pl-2">
          <H3>{t('케리어')}</H3>
          <SettingCheckbox
            label={t('테이블 필터기능')}
            checked={tableFilterCarrier}
            onChange={(e) => handleChange(STORAGE['setting/stats/carrier/table/filter'], e.target.checked)}
          />
          <SettingCheckbox
            label={t('페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForCarrierSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/carrier/page-size'], pageSizeForCarrierSetting ? '' : pageSize)
            }
          />
          {!!pageSizeForCarrierSetting && (
            <SettingPagination
              label={t('페이지당 리스트 수')}
              value={pageSizeForCarrierSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/carrier/page-size'], e.target.value)}
            />
          )}
          <SettingCheckbox
            label={t('달력 기간 커스텀')}
            checked={!!durationForCarrierSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/carrier/duration'], durationForCarrierSetting ? '' : duration)
            }
          />
          {!!durationForCarrierSetting && (
            <SettingDuration
              label={t('달력 기간')}
              value={durationForCarrierSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/carrier/duration'], e.target.value)}
            />
          )}
          <SettingCheckGroup
            label={t('테이블 헤더')}
            labels={theadCarrier}
            fixHead={fixHeadCarrier}
            defaultChecks={columnForCarrier}
            disabled={columnCarrierDisabled}
            onChange={(e) => handleChange(STORAGE['setting/stats/carrier/column'], e)}
          />
        </div>
        <div className="pl-2">
          <H3>{t('워닝')}</H3>
          <SettingCheckbox
            label={t('테이블 필터기능')}
            checked={tableFilterWarning}
            onChange={(e) => handleChange(STORAGE['setting/stats/warning/table/filter'], e.target.checked)}
          />
          <SettingCheckbox
            label={t('페이지당 리스트 수 커스텀')}
            checked={!!pageSizeForWarningSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/warning/page-size'], pageSizeForWarningSetting ? '' : pageSize)
            }
          />
          {!!pageSizeForWarningSetting && (
            <SettingPagination
              label={t('페이지당 리스트 수')}
              value={pageSizeForWarningSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/warning/page-size'], e.target.value)}
            />
          )}
          <SettingCheckbox
            label={t('달력 기간 커스텀')}
            checked={!!durationForWarningSetting}
            onChange={() =>
              handleChange(STORAGE['setting/stats/alarm/duration'], durationForWarningSetting ? '' : duration)
            }
          />
          {!!durationForWarningSetting && (
            <SettingDuration
              label={t('달력 기간')}
              value={durationForWarningSetting}
              onChange={(e) => handleChange(STORAGE['setting/stats/warning/duration'], e.target.value)}
            />
          )}
          <SettingCheckGroup
            label={t('테이블 헤더')}
            labels={theadWarning}
            fixHead={fixHeadWarning}
            defaultChecks={columnForWarning}
            disabled={columnWarningDisabled}
            onChange={(e) => handleChange(STORAGE['setting/stats/warning/column'], e)}
          />
        </div>
        <H2>{t('유저관리')}</H2>
        <SettingCheckbox
          label={t('페이지당 리스트 수 커스텀')}
          checked={!!pageSizeForUsersSetting}
          onChange={() => handleChange(STORAGE['setting/users/page-size'], pageSizeForUsersSetting ? '' : pageSize)}
        />
        {!!pageSizeForUsersSetting && (
          <SettingPagination
            label={t('페이지당 리스트 수')}
            value={pageSizeForUsersSetting}
            onChange={(e) => handleChange(STORAGE['setting/users/page-size'], e.target.value)}
          />
        )}
        <SettingCheckGroup
          label={t('테이블 헤더')}
          labels={theadUsers}
          fixHead={fixHeadUsers}
          defaultChecks={columnForUsers}
          disabled={columnUsersDisabled}
          onChange={(e) => handleChange(STORAGE['setting/users/column'], e)}
        />
      </PageCenter>
    </>
  );
};

export default Setting;
