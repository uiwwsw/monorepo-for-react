import { useHeaderContext } from '@/HeaderContext';
import { Pagination, ToastWithPortal } from '@library-frontend/ui';
import { LocalStorage, createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useCarrierStats, Arg } from '!/stats/application/get-carrier-stats';
import Table from '@/Table';
import { VisibilityColumn, VisibilityState } from '@tanstack/react-table';
import { STORAGE } from '!/storage/domain';
import StatsCalendar from '../Calendar';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Carrier');
const pageSize = 10;

const StatsCarrier = () => {
  /* ======   variables   ====== */
  const fixedCalendar = LocalStorage.get<string[]>(STORAGE['stats/calendar']);
  const columnVisibility = LocalStorage.get<VisibilityColumn>(STORAGE['carrier/table']) ?? {};

  const { setChildren } = useHeaderContext();
  const [totalPageNum, setTotalPageNum] = useState(1);
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-7, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
    page: 1,
    page_size: pageSize,
    find_key: '',
  });
  logger(arg, fixedCalendar);
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);

  const currentPage = useMemo(() => arg.page - 1, [arg]);

  const { error, data, mutate } = useCarrierStats(arg);

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    LocalStorage.set(STORAGE['carrier/table'], value);
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
    // mutate();
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
  logger('render', LocalStorage.get<VisibilityState>('carrier/table'));
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <Table
        thead={[
          'carrierId',
          'endTime',
          'startTime',
          'taskId',
          'zoneIdFrom',
          'zoneIdFromName',
          'zoneIdTo',
          'zoneIdToName',
        ]}
        cacheColumnVisibility={columnVisibility}
        setCacheColumnVisibility={handleVisibility}
        data={data?.rows}
        makePagination={false}
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

export default StatsCarrier;
