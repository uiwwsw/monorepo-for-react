import { useHeaderContext } from '@/HeaderContext';
import { Pagination, ToastWithPortal } from '@library-frontend/ui';
import { LocalStorage, createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Arg, useAlarmStats } from '!/stats/application/get-alarm-stats';
import Table from '@/Table';
import { STORAGE } from '!/storage/domain';
import { VisibilityState } from '@tanstack/react-table';
import StatsCalendar from '../Calendar';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Alarm');
const pageSize = 10;
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const fixedCalendar = LocalStorage.get<string[]>(STORAGE['stats/calendar']);
  const columnVisibility = LocalStorage.get<VisibilityState>(STORAGE['alarm/table']) ?? {};

  const { setChildren } = useHeaderContext();

  const [totalPageNum, setTotalPageNum] = useState(1);
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-7, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
    page: 1,
    page_size: pageSize,
    find_key: '',
  });
  const currentPage = useMemo(() => arg.page - 1, [arg]);
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);

  const { error, data, mutate } = useAlarmStats(arg);

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    LocalStorage.set(STORAGE['alarm/table'], value);
    logger(value);
  };
  const handleCalenderChange = async (duration: Dayjs[]) => {
    await Promise.all([
      setArg((prev) => ({ ...prev, start_time: duration[0].toISOString(), end_time: duration[1].toISOString() })),
    ]);
    mutate();
  };

  const handleSearchKeyword = async (character: string) => {
    if (character === arg.find_key && arg.page === 1) return;
    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: 1,
        find_key: character,
      })),
    ]);
    mutate();
  };

  const handleChangePage = async (page: number) => {
    const nextPage = page + 1;
    if (nextPage === currentPage) return;

    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: nextPage,
      })),
    ]);
    mutate();
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (data?.totalCount) setTotalPageNum(Math.ceil(data.totalCount / pageSize));
  }, [data]);
  useEffect(() => {
    setChildren(<StatsCalendar currentDuration={currentDuration} onChange={handleCalenderChange} />);

    return () => setChildren(undefined);
  }, []);
  logger('render', data);
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>

      <Table
        thead={[
          'no',
          'serialNo',
          'alarmCode',
          'taskId',
          'location',
          'reason',
          'tcmId',
          'commandId',
          'carrierId',
          'setTime',
          'clearTime',
        ]}
        data={data?.rows}
        makePagination={false}
        cacheColumnVisibility={columnVisibility}
        setCacheColumnVisibility={handleVisibility}
        onSearch={handleSearchKeyword}
      />
      <div className="text-center mt-3">
        <Pagination
          onChange={handleChangePage}
          totalPageNum={totalPageNum}
          currentPageIndex={currentPage}
          hasDoubleArrow={true}
        />
      </div>
    </>
  );
};

export default StatsAlarm;
