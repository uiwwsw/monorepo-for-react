import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg, useGetAlarmInfo } from '!/stats/application/get-alarmInfo';
import Table from '@/Table';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Alarm');
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [arg, setArg] = useState<SearchArg>({
    start_time: newDate().toString(),
    end_time: newDate([1, 'day']).toString(),
    page: 0,
    page_size: 10000,
  });

  const { error, mutate, data } = useGetAlarmInfo({ arg: arg });

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    if (duration instanceof Array) {
      setDuration(duration);

      const arg: SearchArg = {
        start_time: duration[0].toString(),
        end_time: duration[1].toString(),
        page: 0,
        page_size: 10000,
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
      page_size: 10000,
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
    handleSearch({
      start_time: newDate().toString(),
      end_time: newDate([1, 'day']).toString(),
      page: 0,
      page_size: 10000,
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
  logger('render', error, mutate, handleSearchKeyword);
  return (
    <>
      <Table
        thead={['No', 'CarrierID', 'Location', 'SetTime', 'ClearTime']}
        data={
          data
            ? data.rows
            : [
                {
                  No: 1,
                  SerialNo: 0,
                  AlarmCode: 0,
                  TaskID: 0,
                  Location: 0,
                  Reason: 0,
                  CommandID: '-',
                  TCMID: 0,
                  CarrierID: '-',
                  SetTime: '-',
                  ClearTime: '-',
                },
              ]
        }
        makePagination={true}
        makeColumnSelect={false}
        onSearch={handleSearchKeyword}
        textAlignCenter={true}
      ></Table>
    </>
  );
};

export default StatsAlarm;
