import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg, StatsAlarmData } from '!/stats/domain';
import { useGetAlarmInfo } from '!/stats/application/get-alarmInfo';
import Table from '@/Table';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Alarm');
const StatsAlarm = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [renderAlarmList, setRenderAlarmList] = useState<StatsAlarmData[]>([]);
  const [arg, setArg] = useState<SearchArg>({
    startTime: newDate().toString(),
    endTime: newDate([1, 'day']).toString(),
    page: 0,
  });

  const { error, mutate, data } = useGetAlarmInfo({ arg: arg });

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const onChangeSearchKeyword = async (character: string) => {
    if (character === '') return;

    const arg: SearchArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      character: character,
      page: 0,
    };

    setArg(arg);
    mutate();
  };

  const handleSearch = async (arg: SearchArg) => {
    setArg(arg);
    mutate();
    //setRenderZone(newRenderZone)
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    data && setRenderAlarmList(data);
  }, [data]);
  useEffect(() => {
    handleSearch({ startTime: newDate().toString(), endTime: newDate([1, 'day']).toString(), page: 0 });
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
  logger('render', error, mutate, onChangeSearchKeyword);
  return (
    <>
      <Table
        thead={['no', 'carrierID', 'zoneID', 'setTime', 'clearTime', 'description']}
        data={
          data
            ? data
            : [
                {
                  no: 0,
                  carrierID: '-',
                  zoneID: 0,
                  setTime: '-',
                  clearTime: '-',
                  description: '-',
                },
              ]
        }
        makePagination={true}
        makeColumnSelect={false}
      ></Table>
    </>
  );
};

export default StatsAlarm;
