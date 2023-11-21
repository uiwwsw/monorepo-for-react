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
  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [pageNum, setPageNum] = useState<number>(0);
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [arg, setArg] = useState<SearchZoneArg>({
    startTime: newDate().toISOString(),
    endTime: newDate([1, 'day']).toISOString(),
    pageNum: 0,
    pagePerCount: 10,
  });
  const [graphArg, setGraphArg] = useState<SearchZoneArg>({
    startTime: newDate().toISOString(),
    endTime: newDate([1, 'day']).toISOString(),
    pageNum: 0,
    pagePerCount: 10,
    zoneID: -1,
  });
  const [graphTotAvr, setGraphTotAvr] = useState<number[]>([0, 0, 0, 0]);

  const { scrollDeps, trigger: scrollTrigger } = useInfiniteScroll();

  const { error, mutate, data, isValidating } = useGetZoneInfo({ arg: arg });
  const { error: graphError, data: graphData, mutate: graphMutate } = useGetGraphInfo({ arg: graphArg });
  const lineData = useMemo(() => (graphData ? dataToChartData(graphData) : []), [graphData]);
  const [renderZone, setRenderZone] = useState<StatsZoneData[]>([]);

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const handleChipChange = async (index: number) => {
    const arg: SearchZoneArg = {
      startTime: duration[0].toISOString(),
      endTime: duration[1].toISOString(),
      sortValue: index,
      pageNum: 0,
      pagePerCount: pagePerCount,
    };
    await Promise.all([setPageNum(0), setCurrentFilterIndex(index), setArg(arg)]);

    await mutate();
    scrollTrigger();
  };

  const onChangeSearchKeyword = async (character: string) => {
    if (character === '') return;

    logger(character);
    const arg: SearchZoneArg = {
      startTime: duration[0].toISOString(),
      endTime: duration[1].toISOString(),
      character: character,
      pageNum: 0,
      pagePerCount: pagePerCount,
    };
    await Promise.all([setPageNum(0), setArg(arg)]);
    mutate();
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

  // const handleSearch = async (arg: SearchZoneArg) => {
  //   await setArg(arg);
  //   graphMutate();
  // };

  const handleScroll = async () => {
    const nextPage = pageNum + 1;
    setPageNum(nextPage);
    const arg: SearchZoneArg = {
      startTime: duration[0].toISOString(),
      endTime: duration[1].toISOString(),
      sortValue: currentFilterIndex,
      pageNum: nextPage,
      pagePerCount: pagePerCount,
    };
    await setArg(arg);
    return await mutate<StatsZoneData[]>();
  };
  // TODO 칩 클릭 중 유저가 다른 행동하면 문제 발생함
  const onClickZoneCard = async (zoneID: number) => {
    const arg: SearchZoneArg = {
      startTime: duration[0].toISOString(),
      endTime: duration[1].toISOString(),
      pageNum: 0,
      pagePerCount: pagePerCount,
      zoneID: zoneID,
    };
    await Promise.all([setArg(arg)]);
    mutate();
  };
  // TODO 최초 진입 시 화면 크기보다 적은 컨텐츠일 경우 스크롤 이벤트가 작동 안해요.
  // 작동할 수 있도록 어떻게 할수있을까요?
  // 반복문으로 최초에 데이터를 불러올 수 있으면 어떨까요? 아래 useEffect, scrollDeps 부분 코드 수정하면 될거같아요.
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!scrollDeps) return setDone(false); // mount 시 실행여부
    handleScroll().then((x) => {
      if (!x?.length) setDone(true);
    });
  }, [scrollDeps]);
  // useEffect(() => {
  //   scrollTrigger();
  //   mutate();
  // }, [arg]);
  // useEffect(() => {
  //   scrollTrigger();
  //   graphMutate();
  // }, [graphArg]);
  // useEffect(() => {
  //   const arg: SearchZoneArg = {
  //     startTime: duration[0].toISOString(),
  //     endTime: duration[1].toISOString(),
  //     pageNum: 0,
  //     pagePerCount: pagePerCount,
  //     zoneID: -1,
  //   };
  //   setArg(arg);
  //   setGraphArg(arg);
  // }, [duration]);
  useEffect(() => {
    if (pageNum === 0 && data) setRenderZone(data);
    else if (data) setRenderZone((prev) => [...prev, ...data]);
  }, [data]);
  useEffect(() => {
    // handleSearch({
    //   startTime: newDate().toISOString(),
    //   endTime: newDate([1, 'day']).toISOString(),
    //   sortValue: currentFilterIndex,
    //   pageNum: 0,
    //   pagePerCount: pagePerCount,
    // });
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
  logger('render', isValidating);
  return (
    <div>
      {/* {isValidating && (
        <span className="fixed inset-0 z-10 flex items-center justify-center">
          <Spinner />
        </span>
      )} */}
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
          onChange={handleScroll}
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
          {
            //TODO 검색 영역에 버튼이 있으면 어떨까요? 그럼 입력 후 다른 액션이 필요하다고 느낄것같아요. 엔터는 부가적인 옵션으로 보면 어떨까~
          }
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
      {!done && (
        <div className="flex items-center justify-center p-10">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default StatsZone;
