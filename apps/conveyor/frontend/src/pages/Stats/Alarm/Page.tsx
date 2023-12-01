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
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
/* ======    global     ====== */
const pageSize = 10;
const logger = createLogger('pages/Stats/Alarm');
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const pageSizeOptions = [
    { value: '5', label: t('5개씩 보기') },
    { value: '10', label: t('10개씩 보기') },
    { value: '20', label: t('20개씩 보기') },
    { value: '30', label: t('30개씩 보기') },
    { value: '40', label: t('40개씩 보기') },
    { value: '50', label: t('50개씩 보기') },
  ];
  const fixedCalendar = LocalStorage.get<string[]>(STORAGE['stats/calendar']);
  const columnVisibility = LocalStorage.get<VisibilityState>(STORAGE['alarm/table']) ?? {};

  const { setChildren } = useHeaderContext();

  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-7, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
    page: 1,
    page_size: pageSize,
    find_key: '',
  });
  const currentPer = useMemo(() => arg.page_size ?? 10, [arg]);
  const currentPage = useMemo(() => arg.page - 1, [arg]);
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);

  const { error, data, mutate } = useAlarmStats(arg);
  const currentTotalPage = useMemo(() => (data ? Math.ceil(data.totalCount / currentPer) : 0), [data]);

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
  const handleChangePer = async (value: number) => {
    await Promise.all([
      setArg((prev) => ({
        ...prev,
        page: 1,
        page_size: value,
      })),
    ]);
    mutate();
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
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    setChildren(<StatsCalendar currentDuration={currentDuration} onChange={handleCalenderChange} />);

    return () => setChildren(undefined);
  }, [currentDuration]);
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
          per={currentPer}
          sizeOptions={pageSizeOptions}
          onChangePer={handleChangePer}
          onChange={handleChangePage}
          max={currentTotalPage}
          index={currentPage}
        />
      </div>
    </>
  );
};

export default StatsAlarm;
