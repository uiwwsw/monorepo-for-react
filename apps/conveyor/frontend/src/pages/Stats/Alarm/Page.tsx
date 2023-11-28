import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar, Pagination } from '@library-frontend/ui';
import { LocalStorage, createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg, useAlarmStats } from '!/stats/application/get-alarm-stats';
import Table from '@/Table';
import { TABLE_COLUMN_VISIBILITY } from '!/storage/domain';
import { VisibilityState } from '@tanstack/react-table';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Alarm');
const pageSize = 10;
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const columnVisibility = LocalStorage.get<VisibilityState>(TABLE_COLUMN_VISIBILITY['alarm/table']) ?? {};
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [totalPageNum, setTotalPageNum] = useState(1);
  const [arg, setArg] = useState<SearchArg>({
    begin_date: newDate([-7, 'day']).toISOString(),
    end_date: newDate().toISOString(),
    page: 1,
    page_size: pageSize,
    find_key: '',
  });
  const currentPage = useMemo(() => arg.page - 1, [arg]);
  const currentDuration = useMemo(() => [arg.begin_date, arg.end_date], [arg]);

  const { error, data, mutate } = useAlarmStats({ arg });

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    LocalStorage.set(TABLE_COLUMN_VISIBILITY['alarm/table'], value);
    logger(value);
  };
  const handleCalenderChange = async (duration: Dayjs | Dayjs[]) => {
    if (!(duration instanceof Array)) return;

    await Promise.all([
      setArg((prev) => ({ ...prev, begin_date: duration[0].toISOString(), end_date: duration[1].toISOString() })),
    ]);
    mutate();
  };

  const handleSearchKeyword = async (character: string) => {
    if (character === '') return;

    await Promise.all([
      setArg((prev) => ({
        ...prev,
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
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          defaultValue={currentDuration}
          onChange={handleCalenderChange}
          button={<Button themeColor={'secondary'} themeSize="sm" className="w-[300px]" />}
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render', data);
  return (
    <>
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
        textAlignCenter={true}
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
