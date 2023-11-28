import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Input, Chip, Button, useInfiniteScroll, Calendar, Spinner } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatsSummaryData, StatsSummaryDataRow, ZoneList } from '!/stats/domain';
import { SearchZoneArg } from '!/stats/application/get-zone-stats';
import { useZoneStats } from '!/stats/application/get-zone-stats';
import { useZoneList } from '!/stats/application/get-zone-list';
import { LineProps } from '@nivo/line';

/* ======   interface   ====== */
enum TOT_AVR {
  carrierTot = 0,
  carrierAvr,
  alarmTot,
  alarmAvr,
}

enum SORT_VALUE {
  zoneID = 0,
  alarm,
  carrier,
}

interface ZoneData {
  zoneId: number;
  displayName: string;
  alarmNum: number;
  carrierNum: number;
  warningNum: number;
}
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Zone');
const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2 text-md';
const colClassName = 'flex justify-center flex-col';
const pagePerCount = 3;

const StatsSummary = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { setChildren } = useHeaderContext();
  const [selectedZoneID, setSelectedZoneID] = useState<string>('ALL');
  const [done, setDone] = useState(false);
  const [arg, setArg] = useState<SearchZoneArg>({
    begin_date: newDate([-7, 'day']).toISOString(),
    end_date: newDate().toISOString(),
  });
  const [graphTotAvr, setGraphTotAvr] = useState<number[]>([0, 0, 0, 0]);
  const [graphData, setGraphData] = useState<LineProps['data']>([]);
  const [renderZone, setRenderZone] = useState<ZoneData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);

  const { scrollDeps, trigger: scrollTrigger } = useInfiniteScroll();
  const { mutate, data, isValidating } = useZoneStats({ arg });
  const { data: zoneList, mutate: zoneListMutate } = useZoneList();

  /* ======   function    ====== */
  const handleCalenderChange = async (duration: Dayjs | Dayjs[]) => {
    if (!(duration instanceof Array)) return;
    const arg: SearchZoneArg = {
      begin_date: duration[0].toISOString(),
      end_date: duration[1].toISOString(),
    };

    await Promise.all([setArg(arg)]);
    mutate();
  };

  const handleChipChange = async (index: number) => {
    let newZoneData = zoneData;
    switch (index) {
      case SORT_VALUE.zoneID:
        newZoneData.sort((a, b) => a.zoneId - b.zoneId);
        break;
      case SORT_VALUE.alarm:
        newZoneData.sort((a, b) => b.alarmNum - a.alarmNum);
        break;
      case SORT_VALUE.carrier:
        newZoneData.sort((a, b) => b.carrierNum - a.carrierNum);
        break;
    }
    setZoneData(newZoneData);
    setRenderZone(newZoneData.slice(0, 10));
    scrollTrigger();
  };

  const onChangeSearchKeyword = async (character: string) => {
    if (character === '') {
      setRenderZone(zoneData.slice(0, 10));
      setDone(false);
    }

    const regex1 = new RegExp(character);
    const find = zoneData.filter((zone: any) => {
      let str = JSON.stringify(zone);
      if (regex1.exec(str) !== null) return true;
      else return false;
    });
    setDone(true);

    setRenderZone(find);
  };

  const onClickZoneCard = async (zoneID: number) => {
    let zoneArr = data?.rows.filter((x) => x.zoneId === zoneID);
    let graphData: LineProps['data'] = [
      { id: 'alarm', data: [] },
      { id: 'carrier', data: [] },
    ];
    let dateLength = zoneArr?.length ? zoneArr.length : 1;
    let alarmTotal = 0;
    let carrierTotal = 0;
    zoneArr?.map((z) => {
      alarmTotal += z.alarmNum;
      carrierTotal += z.carrierNum;
      graphData[0].data.push({ x: z.date, y: z.alarmNum });
      graphData[1].data.push({ x: z.date, y: z.carrierNum });
    });
    let carrierAverage = Math.floor(carrierTotal / dateLength);
    let alarmAverage = Math.floor(alarmTotal / dateLength);
    setGraphTotAvr([carrierTotal, carrierAverage, alarmTotal, alarmAverage]);
    setGraphData(graphData);
    setSelectedZoneID(zoneID.toString());
  };

  const rearrangeData = (data: StatsSummaryDataRow[]) => {
    let newRenderZoneList: ZoneData[] = [];
    let dateIndex = 0;
    let alarm = 0;
    let carrier = 0;
    let date = [data[0].date];
    let graphData: LineProps['data'] = [
      { id: 'alarm', data: [] },
      { id: 'carrier', data: [] },
    ];
    let carrierTotal = 0;
    let alarmTotal = 0;

    zoneList?.map((zone: ZoneList) => {
      let alarmNum = 0,
        carrierNum = 0,
        warningNum = 0;
      let filteredArr = data?.filter((x) => x.zoneId === zone.ZoneID);
      filteredArr?.map((zone) => {
        alarmNum += zone.alarmNum;
        carrierNum += zone.carrierNum;
        warningNum += zone.warningNum;
      });
      newRenderZoneList.push({
        zoneId: zone.ZoneID,
        displayName: zone.DisplayName,
        alarmNum: alarmNum,
        carrierNum: carrierNum,
        warningNum: warningNum,
      });
    });

    data.map((d) => {
      if (d.date === date[dateIndex]) {
        alarm += d.alarmNum;
        carrier += d.carrierNum;
        alarmTotal += d.alarmNum;
        carrierTotal += d.carrierNum;
      } else {
        graphData[0].data.push({ x: date[dateIndex], y: alarm });
        graphData[1].data.push({ x: date[dateIndex], y: carrier });
        dateIndex++;
        alarm = 0;
        carrier = 0;
        date.push(d.date);
        alarmTotal += d.alarmNum;
        carrierTotal += d.carrierNum;
      }
    });
    graphData[0].data.push({ x: date[dateIndex], y: alarm });
    graphData[1].data.push({ x: date[dateIndex], y: carrier });

    const dateLength = graphData[0].data.length;

    let carrierAverage = Math.floor(carrierTotal / dateLength);
    let alarmAverage = Math.floor(alarmTotal / dateLength);
    setGraphTotAvr([carrierTotal, carrierAverage, alarmTotal, alarmAverage]);
    setGraphData(graphData);
    setRenderZone(newRenderZoneList.slice(0, 10));
    setZoneData(newRenderZoneList);
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    if (!scrollDeps) return setDone(false); // mount 시 실행여부
    if (renderZone.length + pagePerCount < zoneData.length) {
      setRenderZone((prev) => [...prev, ...zoneData.slice(renderZone.length, renderZone.length + pagePerCount)]);
    } else if (renderZone.length + pagePerCount >= zoneData.length) {
      setRenderZone((prev) => [...prev, ...zoneData.slice(renderZone.length, zoneData.length)]);
      setDone(true);
    }
  }, [scrollDeps]);

  useEffect(() => {
    data?.rows && rearrangeData(data.rows);
  }, [data]);
  useEffect(() => {
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
      <div className="sticky top-16 bg-white">
        <div className="h-60 flex rounded-xl border mb-3">
          <div className="h-full w-4/5">
            <ChartLine data={graphData} />
          </div>
          <div className="h-full w-1/5 p-1 border-l-2 pt-4">
            <div className={graphChartClassName}>Zone ID : {selectedZoneID}</div>
            <div className={graphChartClassName}>Carrier Total : {graphTotAvr[TOT_AVR.carrierTot]}</div>
            <div className={graphChartClassName}>Carrier Average : {graphTotAvr[TOT_AVR.carrierAvr]}</div>
            <div className={graphChartClassName}>Alarm Total : {graphTotAvr[TOT_AVR.alarmTot]}</div>
            <div className={graphChartClassName}>Alarm Average : {graphTotAvr[TOT_AVR.alarmAvr]}</div>
          </div>
        </div>
        <div className="flex my-5 place-content-end gap-5">
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
            onChange={(e) => onChangeSearchKeyword(e.target.value)}
          />
        </div>
      </div>
      {renderZone.map((zone: ZoneData) => (
        <div
          key={zone.zoneId}
          className="grid border border-slate-300 my-5 p-3 rounded-md grid-cols-5 content-evenly text-center cursor-pointer"
          onClick={() => {
            onClickZoneCard(zone.zoneId);
          }}
        >
          <div className={colClassName + ' bg-slate-500 text-white rounded-lg'}>{zone.displayName}</div>
          <div className={colClassName}>Carrier: {zone.carrierNum}</div>
          <div className={colClassName + ' text-red-400'}>Alarm: {zone.alarmNum}</div>
          <div className={colClassName + ' text-yellow-400'}>Warning: {zone.warningNum}</div>
          <div className="flex-col">
            <div>TCM ID: {Math.round(zone.zoneId / 100)}</div>
            <div>ZONE ID: {zone.zoneId}</div>
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

export default StatsSummary;
