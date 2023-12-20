import { useHeaderContext } from '@/HeaderContext';
import { Pagination, ToastWithPortal, useDebounce } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useCarrierStats, Arg } from '!/stats/application/get-carrier-stats';
import Table from '@/Table';
import { VisibilityColumn, VisibilityState } from '@tanstack/react-table';
import { STORAGE } from '!/storage/domain';
import StatsCalendar from '../Calendar';
// import { useTranslation } from 'react-i18next';
import { pageSizeOptions } from '#/constants';
import { storage } from '#/storage';
import useSetting from '#/useSetting';
import H1 from '@/Typography/H1';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Carrier');
const StatsCarrier = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { pageSize, duration } = useSetting();
  const fixedCalendar = storage.get<string[]>(STORAGE['stats/calendar']);
  const fixedKeyword = storage.get<string>(STORAGE['stats/keyword']);
  const columnVisibility = storage.get<VisibilityColumn>(STORAGE['carrier/table']) ?? {};

  const { setChildren } = useHeaderContext();
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-duration, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
    page: 1,
    page_size: pageSize,
    find_key: fixedKeyword ?? '',
  });
  const currentPer = useMemo(() => arg.page_size ?? pageSize, [arg]);
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);
  const currentPage = useMemo(() => arg.page - 1, [arg]);

  const { error, data, mutate } = useCarrierStats(arg);
  const currentTotalPage = useMemo(() => (data ? Math.ceil(data.totalCount / currentPer) : 0), [data]);

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    storage.set(STORAGE['carrier/table'], value);
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
  logger('render', storage.get<VisibilityState>(STORAGE['carrier/table']));
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <H1>{t('케리어')}</H1>

      <Table
        mustHaveColumn={['carrierId']}
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
        totalLength={data?.totalCount}
        cacheColumnVisibility={columnVisibility}
        setCacheColumnVisibility={handleVisibility}
        data={data?.rows}
        makePagination={false}
        pagination={
          <Pagination
            per={currentPer}
            sizeOptions={pageSizeOptions}
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

export default StatsCarrier;
