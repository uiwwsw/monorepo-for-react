import { useHeaderContext } from '@/HeaderContext';
import { Calendar } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg } from '!/stats/domain';
import { useGetZoneInfo } from '!/stats/application/get-zoneInfo';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats');
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>();

  const { trigger, error, isMutating } = useGetZoneInfo();

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const onChangeSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    /** find data with keyword */
  };

  const handleSearch = async (arg: SearchArg) => {
    const newRenderZone = await trigger(arg);
    //setRenderZone(newRenderZone)
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    handleSearch({ startTime: newDate().toString(), endTime: newDate(1).toString() });
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleCalenderChange}
          themeColor="secondary"
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render');
  return <></>;
};

export default StatsAlarm;
