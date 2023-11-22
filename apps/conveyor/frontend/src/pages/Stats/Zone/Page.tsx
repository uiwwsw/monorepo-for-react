import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Input, Chip, Button, useInfiniteScroll, Calendar, Spinner } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatsGraphData, StatsZoneData } from '!/stats/domain';
import { SearchZoneArg } from '!/stats/application/get-zoneInfo';
import { useGetZoneInfo } from '!/stats/application/get-zoneInfo';
import { useGetGraphInfo } from '!/stats/application/get-graphInfo';
import { LineProps } from '@nivo/line';

/* ======   interface   ====== */
enum TotAvr {
  CarrierTot = 0,
  CarrierAvr,
  AlarmTot,
  AlarmAvr,
}
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Zone');
const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2 text-md';
const colClassName = 'flex justify-center flex-col';
const pagePerCount = 10;

const StatsZone = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { setChildren } = useHeaderContext();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const scrollDeps = useInfiniteScroll();
  const [pageNum, setPageNum] = useState<number>(0);
  const [renderZone, setRenderZone] = useState<StatsZoneData[]>([]);
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(0);
  const [arg, setArg] = useState<SearchZoneArg>({
    startTime: newDate().toString(),
    endTime: newDate([1, 'day']).toString(),
    pageNum: 0,
    pagePerCount: 10,
  });
  const [graphArg, setGraphArg] = useState<SearchZoneArg>({
    startTime: newDate().toString(),
    endTime: newDate([1, 'day']).toString(),
    pageNum: 0,
    pagePerCount: 10,
    zoneID: -1,
  });
  const [graphTotAvr, setGraphTotAvr] = useState<number[]>([0, 0, 0, 0]);

  const { error, mutate, data } = useGetZoneInfo({ arg: arg });
  const { error: graphError, data: graphData, mutate: graphMutate } = useGetGraphInfo({ arg: graphArg });
  const lineData = useMemo(() => (graphData ? dataToChartData(graphData) : []), [graphData]);

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const handleChipChange = async (index: number) => {
    const arg: SearchZoneArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      sortValue: index,
      pageNum: 0,
      pagePerCount: pagePerCount,
    };
    setPageNum(0);
    setCurrentFilterIndex(index);
    setArg(arg);
  };

  const onChangeSearchKeyword = (character: string) => {
    if (character === '') return;

    logger(character);
    const arg: SearchZoneArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      character: character,
      pageNum: 0,
      pagePerCount: pagePerCount,
    };

    setPageNum(0);
    setArg(arg);
  };

  function dataToChartData(loadedData: StatsGraphData) {
    let lineData: LineProps['data'] = [
      { id: 'alarm', data: [] },
      { id: 'carrier', data: [] },
    ];
    let carrierTotal = 0;
    let alarmTotal = 0;
    loadedData.data.map((i) => {
      lineData[0].data
        ? lineData[0].data.push({ x: i.date, y: i.alarm })
        : (lineData[0].data = [{ x: i.date, y: i.alarm }]);
      lineData[1].data
        ? lineData[1].data.push({ x: i.date, y: i.transfer })
        : (lineData[1].data = [{ x: i.date, y: i.transfer }]);
      carrierTotal += i.transfer;
      alarmTotal += i.alarm;
    });
    let carrierAverage = Math.round(carrierTotal / loadedData.data.length);
    let alarmAverage = Math.round(alarmTotal / loadedData.data.length);
    setGraphTotAvr([carrierTotal, carrierAverage, alarmTotal, alarmAverage]);
    logger(lineData);
    return lineData;
  }

  const handleSearch = async (arg: SearchZoneArg) => {
    await setArg(arg);
    graphMutate();
  };

  const handleChangePage = () => {
    setLoading(true);
    setPageNum(pageNum + 1);
    const arg: SearchZoneArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      sortValue: currentFilterIndex,
      pageNum: pageNum + 1,
      pagePerCount: pagePerCount,
    };
    setArg(arg);
    setLoading(false);
    return renderZone;
  };

  const onClickZoneCard = (zoneID: number) => {
    const arg: SearchZoneArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      pageNum: 0,
      pagePerCount: pagePerCount,
      zoneID: zoneID,
    };
    setGraphArg(arg);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!scrollDeps) return; // mount 시 실행여부
    handleChangePage();
  }, [scrollDeps]);
  useEffect(() => {
    mutate();
  }, [arg]);
  useEffect(() => {
    graphMutate();
  }, [graphArg]);
  useEffect(() => {
    const arg: SearchZoneArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      pageNum: 0,
      pagePerCount: pagePerCount,
      zoneID: -1,
    };
    setArg(arg);
    setGraphArg(arg);
  }, [duration]);
  useEffect(() => {
    if (pageNum === 0 && data) setRenderZone(data);
    else data && setRenderZone(renderZone.concat(data));
  }, [data]);
  useEffect(() => {
    handleSearch({
      startTime: newDate().toString(),
      endTime: newDate([1, 'day']).toString(),
      sortValue: currentFilterIndex,
      pageNum: 0,
      pagePerCount: pagePerCount,
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
  logger('render', error, mutate, graphError, graphMutate, pageNum, currentFilterIndex);
  return (
    <div>
      {loading && (
        <span className="fixed inset-0 z-10 flex items-center justify-center">
          <Spinner />
        </span>
      )}
      <div className="sticky top-16 bg-white">
        <div className="h-60 flex rounded-xl border mb-3">
          <div className="h-full w-4/5">
            <ChartLine data={lineData} />
          </div>
          <div className="h-full w-1/5 p-1 pl-3 border-l-2 pt-8">
            <div className={graphChartClassName}>Carrier Total : {graphTotAvr[TotAvr.CarrierTot]}</div>
            <div className={graphChartClassName}>Carrier Average : {graphTotAvr[TotAvr.CarrierAvr]}</div>
            <div className={graphChartClassName}>Alarm Total : {graphTotAvr[TotAvr.AlarmTot]}</div>
            <div className={graphChartClassName}>Alarm Average : {graphTotAvr[TotAvr.AlarmAvr]}</div>
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
          <Input
            type="search"
            placeholder="search"
            role="textbox"
            onKeyUp={(e) => {
              if (e.code === 'Enter') onChangeSearchKeyword(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      {renderZone.map((zone: StatsZoneData) => (
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
    </div>
  );
};

export default StatsZone;
