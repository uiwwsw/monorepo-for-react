import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Select, Input, Chip, Button } from '@library-frontend/ui';
import { Calendar } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg, StatsZoneData } from '!/stats/domain';
import { useGetZoneInfo } from '!/stats/application/get-zoneInfo';
import { useGetGraphInfo } from '!/stats/application/get-graphInfo';

const zones: StatsZoneData[] = [
  { zoneID: 10101, displayName: '10101', alarmNum: 0, carrierNum: 10, warningNum: 1 },
  { zoneID: 10102, displayName: '10102', alarmNum: 1, carrierNum: 0, warningNum: 3 },
  { zoneID: 10103, displayName: '10103', alarmNum: 0, carrierNum: 31, warningNum: 0 },
  { zoneID: 10104, displayName: '10104', alarmNum: 0, carrierNum: 22, warningNum: 0 },
  { zoneID: 10105, displayName: '10105', alarmNum: 3, carrierNum: 0, warningNum: 0 },
  { zoneID: 10106, displayName: '10106', alarmNum: 0, carrierNum: 0, warningNum: 3 },
  { zoneID: 10107, displayName: '10107', alarmNum: 0, carrierNum: 0, warningNum: 2 },
  { zoneID: 10201, displayName: '10201', alarmNum: 0, carrierNum: 6, warningNum: 0 },
  { zoneID: 10202, displayName: '10202', alarmNum: 2, carrierNum: 0, warningNum: 0 },
];

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Zone');
const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2 text-sm';
const colClassName = 'flex justify-center flex-col';
const StatsZone = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [renderZone, setRenderZone] = useState<StatsZoneData[]>(zones);
  const [totalPageNum, setTotalPageNum] = useState<number>(1);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
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

  const { trigger, error, isMutating } = useGetZoneInfo();
  const { trigger: graphTrigger, error: graphError, isMutating: graphMutating } = useGetGraphInfo();

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const handleChipChange = async (index: number) => {
    const arg: SearchArg = { startTime: duration[0].toString(), endTime: duration[1].toString(), sortValue: index };
    const newRenderZone = await trigger(arg);
    logger(newRenderZone);
  };

  const onChangeGraphPort = (_: ChangeEvent<HTMLSelectElement>) => {
    /* find data with selected port */
  };

  const onChangeSearchKeyword = (_: ChangeEvent<HTMLInputElement>) => {
    /** find data with keyword */
  };

  const handleSearch = async (arg: SearchArg) => {
    const newRenderZone = await trigger(arg);
    const newGraphData = await graphTrigger(arg);
    logger(newRenderZone, newGraphData);
    //setRenderZone(newRenderZone)
    setTotalPageNum(Math.floor(renderZone.length / 5) + 1);

    setCurrentPageIndex(0);
  };

  const handleChangePage = (index: number) => {
    //find next page zone list

    //temporary
    const startIndex = index > 0 ? index * 5 : 0;
    const endIndex = startIndex + 5 < zones.length ? startIndex + 5 : zones.length;
    const newSetRenderZone = zones.slice(startIndex, endIndex);
    setCurrentPageIndex(index);
    setRenderZone(newSetRenderZone);
  };

  const onClickZoneCard = (_: number) => {
    //find data with zoneID
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    handleSearch({ startTime: newDate().toString(), endTime: newDate([1, 'day']).toString() });
    handleChangePage(0);
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
  logger('render', error, isMutating, graphError, graphMutating, totalPageNum, currentPageIndex);
  return (
    <>
      <div className="h-60 flex rounded-xl border mb-3">
        <div className="h-full w-4/5">
          <ChartLine />
        </div>
        <div className="h-full w-1/5 p-1 pl-3 border-l-2">
          <Select className="w-full" options={options} onChange={onChangeGraphPort} />
          <div className={graphChartClassName}>Transport Total : {}</div>
          <div className={graphChartClassName}>Transport Average : {}</div>
          <div className={graphChartClassName}>Alarm Total : {}</div>
          <div className={graphChartClassName}>Alarm Average : {}</div>
        </div>
      </div>
      <div className="flex my-5 place-content-end gap-5">
        {/* <Pagination
          onChange={handleChangePage}
          totalPageNum={totalPageNum}
          currentPageIndex={currentPageIndex}
          hasDoubleArrow={true}
        /> */}
        <Chip
          labels={['ZONE ID', 'ALARM', 'CARRIER']}
          multiChoice={false}
          themeSize={'md'}
          onChange={handleChipChange}
        />
        <Input type="search" placeholder="search" role="textbox" onChange={onChangeSearchKeyword} />
      </div>
      {renderZone.map((zone) => (
        <div
          key={zone.zoneID}
          className="grid border border-slate-300 my-5 p-3 rounded-md grid-cols-5 content-evenly text-center cursor-pointer"
          onClick={() => {
            onClickZoneCard(zone.zoneID);
          }}
        >
          <div className={colClassName + ' bg-slate-500 text-white rounded-lg'}>{zone.displayName}</div>
          <div className={colClassName}>Carrier: {zone.carrierNum}</div>
          <div className={colClassName + ' text-red-400'}>Alarm: {zone.alarmNum}</div>
          <div className={colClassName + ' text-yellow-400'}>Warning: {zone.warningNum}</div>
          <div className="flex-col">
            <div>TCM ID: {Math.round(zone.zoneID / 100)}</div>
            <div>ZONE ID: {zone.zoneID}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsZone;
