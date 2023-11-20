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
  const [arg, setArg] = useState<SearchArg>({
    startTime: newDate().toString(),
    endTime: newDate([1, 'day']).toString(),
  });

  const { error, data, mutate } = useGetCarrierInfo({ arg: arg });

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const handleSearchKeyword = async (character: string) => {
    if (character === '') return;

    const arg: SearchArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      character: character,
    };
    setArg(arg);
  };

  const handleSearch = async (arg: SearchArg) => {
    setArg(arg);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    mutate();
  }, [arg]);
  useEffect(() => {
    handleSearch({ startTime: newDate().toString(), endTime: newDate([1, 'day']).toString() });
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
        thead={['no', 'carrierID', 'input', 'installedTime', 'output', 'completeTime']}
        data={
          data
            ? data
            : [
                {
                  no: 0,
                  carrierID: '-',
                  input: '-',
                  installedTime: '-',
                  output: '-',
                  completeTime: '-',
                },
              ]
        }
        makePagination={true}
        makeColumnSelect={false}
        onSearch={handleSearchKeyword}
        filterWithEnter={true}
      ></Table>
    </>
  );
};

export default StatsCarrier;
