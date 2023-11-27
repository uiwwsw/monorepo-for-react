import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar, Pagination } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg } from '!/stats/application/get-alarmInfo';
import { useGetCarrierInfo } from '!/stats/application/get-carrierInfo';
import Table from '@/Table';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Carrier');
const pageSize = 10;
const StatsCarrier = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [totalPageNum, setTotalPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [findKey, setFindKey] = useState('');
  const [arg, setArg] = useState<SearchArg>({
    begin_date: newDate().toISOString(),
    end_date: newDate([1, 'day']).toISOString(),
    page: 0,
    page_size: pageSize,
  });

  const { error, data, mutate } = useGetCarrierInfo({ arg: arg });

  /* ======   function    ====== */
  const handleCalenderChange = async (duration: Dayjs | Dayjs[]) => {
    if (duration instanceof Array) {
      setDuration(duration);
      const arg: SearchArg = {
        begin_date: duration[0].toISOString(),
        end_date: duration[1].toISOString(),
        page: 0,
        page_size: pageSize,
      };
      await Promise.all([setArg(arg)]);
      mutate();
    }
    setCurrentPage(0);
  };

  const handleSearchKeyword = async (character: string) => {
    if (character === '') return;

    await Promise.all([setFindKey(character)]);
    handleSearch(0);
    setCurrentPage(0);
  };

  const handleSearch = async (page: number) => {
    let arg: SearchArg = {
      begin_date: duration[0].toISOString(),
      end_date: duration[1].toISOString(),
      page: page,
      page_size: pageSize,
    };
    if (findKey.length > 0) arg.find_key = findKey;
    await Promise.all([setArg(arg)]);
    mutate();
  };

  const handleChangePage = (page: number) => {
    handleSearch(page);
    setCurrentPage(page);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (data?.total_count) setTotalPageNum(Math.ceil(data.total_count / pageSize));
  }, [data]);
  useEffect(() => {
    setArg({
      begin_date: newDate().toISOString(),
      end_date: newDate([1, 'day']).toISOString(),
      page: 0,
      page_size: 10,
    });
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
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
  logger('render', handleSearchKeyword, error, mutate);
  return (
    <>
      <Table
        thead={['CarrierID', 'ZoneIDFrom', 'ZoneIDFromName', 'StartTime', 'ZoneIDTo', 'ZoneIDToName', 'EndTime']}
        data={
          data
            ? data.rows
            : [
                {
                  CarrierID: '-',
                  CommandID: '-',
                  TaskID: 0,
                  ZoneIDFromName: '-',
                  StartTime: '-',
                  ZoneIDToName: '-',
                  EndTime: '-',
                  ZoneIDFrom: 0,
                  ZoneIDTo: 0,
                },
              ]
        }
        makePagination={false}
        makeColumnSelect={false}
        onSearch={handleSearchKeyword}
        textAlignCenter={true}
      ></Table>
      <Pagination
        onChange={handleChangePage}
        totalPageNum={totalPageNum}
        currentPageIndex={currentPage}
        hasDoubleArrow={true}
      />
    </>
  );
};

export default StatsCarrier;
