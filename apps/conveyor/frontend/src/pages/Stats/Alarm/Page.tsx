import { useHeaderContext } from '@/HeaderContext';
import { Pagination, ToastWithPortal, useDebounce } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Arg, useAlarmStats } from '!/stats/application/get-alarm-stats';
import Table from '@/Table';
import { STORAGE } from '!/storage/domain';
import StatsCalendar from '../Calendar';
// import { useTranslation } from 'react-i18next';
import { storage } from '#/storage';
import useSetting from '#/useSetting';
import H1 from '@/Typography/H1';
import { useTranslation } from 'react-i18next';
import { VisibilityState } from '@tanstack/react-table';
import { TheadAlarm, fixHeadAlarm, mustHaveColumnAlarm } from '!/stats/domain';

/* ======   interface   ====== */

/* ======    global     ====== */

const logger = createLogger('pages/Stats/Alarm');
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { pageSizeForAlarm, durationForAlarm, columnForAlarm, tableFilterAlarm } = useSetting();
  const thead = Object.entries(columnForAlarm)
    .filter(([_, val]) => val)
    .map(([key]) => key) as TheadAlarm[];
  const fixedCalendar = storage.get<string[]>(STORAGE['stats/calendar']);
  const fixedKeyword = storage.get<string>(STORAGE['stats/keyword']);
  const fixedColumn = storage.get<VisibilityState>(STORAGE['stats/alarm/column']) ?? {};

  const { setChildren } = useHeaderContext();
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-durationForAlarm, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
    page: 1,
    page_size: pageSizeForAlarm,
    find_key: fixedKeyword ?? '',
  });
  const currentPer = useMemo(() => arg.page_size ?? 10, [arg]);
  const currentPage = useMemo(() => arg.page - 1, [arg]);
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);

  const { error, data, mutate } = useAlarmStats(arg);
  const currentTotalPage = useMemo(() => (data ? Math.ceil(data.totalCount / currentPer) : 0), [data]);

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    storage.set(STORAGE['stats/alarm/column'], value);
    logger('handleVisibility', value);
  };
  const handleCalenderChange = async (duration: Dayjs[]) => {
    await Promise.all([
      setArg((prev) => ({ ...prev, start_time: duration[0].toISOString(), end_time: duration[1].toISOString() })),
    ]);
    mutate();
    logger('handleCalenderChange', duration);
  };

  const handleSearchKeyword = useDebounce(async (e: ChangeEvent<HTMLInputElement>) => {
    const character = e.target.value;
    if (character === arg.find_key && arg.page === 1) return;
    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: 1,
        find_key: character,
      })),
    ]);
    mutate();
    logger('handleSearchKeyword', character);
  });
  const handleChangePer = async (value: number) => {
    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: 1,
        page_size: value,
      })),
    ]);
    mutate();
    logger('handleChangePer', value);
  };
  const handleChangePage = async (page: number) => {
    if (page === currentPage) return;
    const nextPage = page + 1;

    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: nextPage,
      })),
    ]);
    mutate();
    logger('handleChangePage', nextPage);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    setChildren(
      <StatsCalendar
        currentDuration={currentDuration}
        onChange={handleCalenderChange}
        onChangeKeyword={handleSearchKeyword}
      />,
    );

    logger('useEffect', currentDuration);
    return () => setChildren(undefined);
  }, [currentDuration]);
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>

      <H1>{t('알람')}</H1>

      <Table
        tableFilter={tableFilterAlarm}
        thead={thead}
        mustHaveColumn={mustHaveColumnAlarm}
        fixHead={fixHeadAlarm}
        totalLength={data?.totalCount}
        data={data?.rows}
        makePagination={false}
        cacheColumnVisibility={fixedColumn}
        setCacheColumnVisibility={handleVisibility}
        pagination={
          <Pagination
            per={currentPer}
            onChangePer={handleChangePer}
            onChange={handleChangePage}
            max={currentTotalPage}
            index={currentPage}
          />
        }
      />
    </>
  );
};

export default StatsAlarm;
