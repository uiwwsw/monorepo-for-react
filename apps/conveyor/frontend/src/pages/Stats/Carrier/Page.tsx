import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar } from '@library-frontend/ui';
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
const StatsCarrier = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [arg, setArg] = useState<SearchArg>({
    start_time: newDate().toString(),
    end_time: newDate([1, 'day']).toString(),
    page: 0,
    page_size: 10,
  });

  const { error, data, mutate } = useGetCarrierInfo({ arg: arg });

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    if (duration instanceof Array) {
      setDuration(duration);
      const arg: SearchArg = {
        start_time: duration[0].toString(),
        end_time: duration[1].toString(),
        page: 0,
        page_size: 10,
      };
      setArg(arg);
    }
  };

  const handleSearchKeyword = async (character: string) => {
    if (character === '') return;

    const arg: SearchArg = {
      start_time: duration[0].toString(),
      end_time: duration[1].toString(),
      find_key: character,
      page: 0,
      page_size: 10,
    };
    setArg(arg);
  };

  const handleSearch = async () => {
    await mutate();
    data && setTotalPageNum(Math.floor(data.total_count) + 1);
  };

  const handleChangePage = (character?: string) => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const arg: SearchArg = {
      start_time: duration[0].toString(),
      end_time: duration[1].toString(),
      page: nextPage,
      page_size: 10,
    };
    character ? (arg.find_key = character) : null;

    setArg(arg);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    mutate();
  }, [arg]);
  useEffect(() => {
    setArg({ start_time: newDate().toString(), end_time: newDate([1, 'day']).toString(), page: 0, page_size: 10 });
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
        makePagination={true}
        makeColumnSelect={false}
        onSearch={handleSearchKeyword}
        textAlignCenter={true}
      ></Table>
      {/* <Pagination
        onChange={handleChangePage}
        totalPageNum={totalPageNum}
        currentPageIndex={currentPage}
        hasDoubleArrow={true}
      /> */}
    </>
  );
};

export default StatsCarrier;
