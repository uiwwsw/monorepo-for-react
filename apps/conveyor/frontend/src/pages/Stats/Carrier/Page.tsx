import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar, Pagination } from '@library-frontend/ui';
import { LocalStorage, createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCarrierStats, SearchArg } from '!/stats/application/get-carrier-stats';
import Table from '@/Table';
import { VisibilityColumn, VisibilityState } from '@tanstack/react-table';
import { TABLE_COLUMN_VISIBILITY } from '!/storage/domain';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Carrier');
const pageSize = 10;

const StatsCarrier = () => {
  /* ======   variables   ====== */
  const columnVisibility = LocalStorage.get<VisibilityColumn>(TABLE_COLUMN_VISIBILITY['carrier/table']) ?? {};
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
  const currentDuration = useMemo(() => [arg.begin_date, arg.end_date], [arg]);
  const currentPage = useMemo(() => arg.page - 1, [arg]);

  const { error, data, mutate } = useCarrierStats({ arg });

  /* ======   function    ====== */
  const handleVisibility = async (value: VisibilityState) => {
    LocalStorage.set(TABLE_COLUMN_VISIBILITY['carrier/table'], value);
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
          defaultValue={currentDuration}
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleCalenderChange}
          button={<Button themeColor={'secondary'} themeSize="sm" className="w-[300px]" />}
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render', LocalStorage.get<VisibilityState>('carrier/table'));
  return (
    <>
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

export default StatsCarrier;
