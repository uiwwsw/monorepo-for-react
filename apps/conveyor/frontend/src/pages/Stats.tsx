import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Tab, Select, Input, Button, Chip } from '@library-frontend/ui';
import { Calendar } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { statsZone } from '!/zone/domain';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats');
const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2';
const sortBtnClassName = 'border-2 px-2 mx-1 align-middle rounded-lg text-gray-200 cursor-pointer py-2 text-sm h-fit';
const Stats = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([]);
  const options = [
    {
      label: 'All',
      value: '1',
    },
    {
      label: 'Input1',
      value: '2',
    },
  ];

  const zones: statsZone[] = [
    { zoneID: 10101, displayName: '10101', alarmNum: 0, carrierNum: 10, warningNum: 1 },
    { zoneID: 10102, displayName: '10102', alarmNum: 1, carrierNum: 0, warningNum: 3 },
  ];

  /* ======   function    ====== */
  const handleChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const onChangeGraphPort = (e: ChangeEvent<HTMLSelectElement>) => {
    /* find data with selected port */
  };

  const onChangeSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    /** find data with keyword */
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleChange}
          themeColor="secondary"
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render');
  return (
    <>
      <div className="h-60 flex rounded-xl border mb-3">
        <div className="h-full w-4/5">
          <ChartLine />
        </div>
        <div className="h-full w-1/5 p-1 pl-3 border-l-2">
          <Select options={options} onChange={onChangeGraphPort} />
          <div className={graphChartClassName}>Transport Total : {}</div>
          <div className={graphChartClassName}>Transport Average : {}</div>
          <div className={graphChartClassName}>Alarm Total : {}</div>
          <div className={graphChartClassName}>Alarm Average : {}</div>
        </div>
      </div>
      <div className="flex my-5 place-content-end gap-5">
        <Chip labels={['ZONE ID', 'ALARM', 'CARRIER']} multiChoice={false} themeSize={'md'} />
        <Input type="search" placeholder="search" role="textbox" onChange={onChangeSearchKeyword} />
      </div>
      {zones.map((zone: statsZone) => (
        <div className="flex border border-slate-400 my-5 p-3 rounded-md">
          {zone.displayName}
          {'   ' + zone.carrierNum}
        </div>
      ))}
    </>
  );
};

export default Stats;
