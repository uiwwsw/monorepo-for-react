import { useHeaderContext } from '@/HeaderContext';
import { Button, Calendar, ToastWithPortal } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useZoneStats, Arg } from '!/stats/application/get-zone-stats';
import { useZoneList } from '!/stats/application/get-zone-list';
import Table from '@/Table';
import StatsSummaryGraphic, { StatsSummaryGraphicProps } from './Graphic';

/* ======   interface   ====== */
// enum TOT_AVR {
//   carrierTot = 0,
//   carrierAvr,
//   alarmTot,
//   alarmAvr,
// }

// enum SORT_VALUE {
//   zoneID = 0,
//   alarm,
//   carrier,
// }

// interface ZoneData {
//   zoneId: number;
//   displayName: string;
//   alarmNum: number;
//   carrierNum: number;
//   warningNum: number;
// }
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Zone');
// const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2 text-md';
// const colClassName = 'flex-auto justify-center';
// const pagePerCount = 30;

const StatsSummary = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { setChildren } = useHeaderContext();
  const [arg, setArg] = useState<Arg>({
    begin_date: newDate([-30, 'day']).toISOString(),
    end_date: newDate().toISOString(),
  });
  const currentDuration = useMemo(() => [arg.begin_date, arg.end_date], [arg]);
  // const [graphTotAvr, setGraphTotAvr] = useState<number[]>([0, 0, 0, 0]);
  // const [graphData, setGraphData] = useState<LineProps['data']>([]);
  // const [renderZone, setRenderZone] = useState<ZoneData[]>([]);
  // const [zoneData, setZoneData] = useState<ZoneData[]>([]);

  // const { scrollDeps, trigger: scrollTrigger } = useInfiniteScroll();
  const { mutate, data: statsData, error: statsError } = useZoneStats(arg);
  const { data: zoneData, error: zoneError } = useZoneList();
  const renderZone = useMemo(
    () =>
      statsData?.rows.map((x) => {
        const currentZoneList = zoneData?.zones.find((z) => z.zoneId === x.zoneId);
        return {
          ...x,
          ...currentZoneList,
        };
      }),
    [statsData, zoneData],
  );
  const statsSummaryGraphicProps: StatsSummaryGraphicProps<typeof renderZone> = useMemo(
    () => ({
      statsData: statsData?.rows,
      zoneData: zoneData?.zones,
    }),
    [statsData, zoneData],
  );

  /* ======   function    ====== */
  const handleCalenderChange = async (duration: Dayjs | Dayjs[]) => {
    if (!(duration instanceof Array)) return;
    const arg: Arg = {
      begin_date: duration[0].toISOString(),
      end_date: duration[1].toISOString(),
    };

    await Promise.all([setArg(arg)]);
    mutate();
  };

  // const handleChipChange = async (index: number) => {
  //   let newZoneData = zoneData;
  //   switch (index) {
  //     case SORT_VALUE.zoneID:
  //       newZoneData.sort((a, b) => a.zoneId - b.zoneId);
  //       break;
  //     case SORT_VALUE.alarm:
  //       newZoneData.sort((a, b) => b.alarmNum - a.alarmNum);
  //       break;
  //     case SORT_VALUE.carrier:
  //       newZoneData.sort((a, b) => b.carrierNum - a.carrierNum);
  //       break;
  //   }
  //   setZoneData(newZoneData);
  //   setRenderZone(newZoneData.slice(0, pagePerCount));
  //   scrollTrigger();
  // };

  // const onChangeSearchKeyword = async (character: string) => {
  //   if (character === '') {
  //     setRenderZone(zoneData.slice(0, pagePerCount));
  //     setDone(false);
  //   }

  //   const regex1 = new RegExp(character);
  //   const find = zoneData.filter((zone: any) => {
  //     let str = JSON.stringify(zone);
  //     if (regex1.exec(str) !== null) return true;
  //     else return false;
  //   });
  //   setDone(true);

  //   setRenderZone(find);
  // };

  // const onClickZoneCard = async (zoneID: number) => {
  //   const zoneArr = data?.rows.filter((x) => x.zoneId === zoneID);
  //   const graphData: LineProps['data'] = [
  //     { id: 'alarm', data: [] },
  //     { id: 'carrier', data: [] },
  //   ];
  //   const dateLength = zoneArr?.length ? zoneArr.length : 1;
  //   let alarmTotal = 0;
  //   let carrierTotal = 0;
  //   zoneArr?.forEach((z) => {
  //     alarmTotal += z.alarmNum;
  //     carrierTotal += z.carrierNum;
  //     graphData[0].data.push({ x: z.date, y: z.alarmNum });
  //     graphData[1].data.push({ x: z.date, y: z.carrierNum });
  //   });
  //   const carrierAverage = Math.floor(carrierTotal / dateLength);
  //   const alarmAverage = Math.floor(alarmTotal / dateLength);
  //   setGraphTotAvr([carrierTotal, carrierAverage, alarmTotal, alarmAverage]);
  //   setGraphData(graphData);
  //   setSelectedZoneId(zoneID.toString());
  // };

  // const rearrangeData = (data: StatsSummaryDataRow[]) => {
  //   const newRenderZoneList: ZoneData[] = [];
  //   let dateIndex = 0;
  //   let alarm = 0;
  //   let carrier = 0;
  //   const date = [data[0].date];
  //   const graphData: LineProps['data'] = [
  //     { id: 'alarm', data: [] },
  //     { id: 'carrier', data: [] },
  //   ];
  //   let carrierTotal = 0;
  //   let alarmTotal = 0;

  //   zoneList?.forEach((zone: ZoneList) => {
  //     let alarmNum = 0,
  //       carrierNum = 0,
  //       warningNum = 0;
  //     data
  //       .filter((x) => x.zoneId === zone.ZoneID)
  //       .forEach((zone) => {
  //         alarmNum += zone.alarmNum;
  //         carrierNum += zone.carrierNum;
  //         warningNum += zone.warningNum;
  //       });
  //     newRenderZoneList.push({
  //       zoneId: zone.ZoneID,
  //       displayName: zone.DisplayName,
  //       alarmNum: alarmNum,
  //       carrierNum: carrierNum,
  //       warningNum: warningNum,
  //     });
  //   });

  //   data.forEach((d) => {
  //     if (d.date === date[dateIndex]) {
  //       alarm += d.alarmNum;
  //       carrier += d.carrierNum;
  //       alarmTotal += d.alarmNum;
  //       carrierTotal += d.carrierNum;
  //     } else {
  //       graphData[0].data.push({ x: date[dateIndex], y: alarm });
  //       graphData[1].data.push({ x: date[dateIndex], y: carrier });
  //       dateIndex++;
  //       alarm = 0;
  //       carrier = 0;
  //       date.push(d.date);
  //       alarmTotal += d.alarmNum;
  //       carrierTotal += d.carrierNum;
  //     }
  //   });
  //   graphData[0].data.push({ x: date[dateIndex], y: alarm });
  //   graphData[1].data.push({ x: date[dateIndex], y: carrier });

  //   const dateLength = graphData[0].data.length;

  //   let carrierAverage = Math.floor(carrierTotal / dateLength);
  //   let alarmAverage = Math.floor(alarmTotal / dateLength);
  //   setGraphTotAvr([carrierTotal, carrierAverage, alarmTotal, alarmAverage]);
  //   setGraphData(graphData);
  //   setRenderZone(newRenderZoneList.slice(0, pagePerCount));
  //   setZoneData(newRenderZoneList);
  // };
  /* ======   useEffect   ====== */
  // useEffect(() => {
  //   if (!scrollDeps) return setDone(false); // mount 시 실행여부
  //   // setRenderZone((prev) => [...prev, ...zoneData.slice(renderZone.length, renderZone.length + pagePerCount)]);
  //   // if (renderZone.length + pagePerCount >= zoneData.length) setDone(true);
  // }, [scrollDeps]);

  useEffect(() => {
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          defaultValue={currentDuration}
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
  logger('render');
  return (
    <>
      <ToastWithPortal open={statsError?.message}>{statsError?.message}</ToastWithPortal>
      <ToastWithPortal open={zoneError?.message}>{zoneError?.message}</ToastWithPortal>

      <div className="relative pt-80">
        {/* <StatsSummaryGraphic {...statsSummaryGraphicProps} /> */}
        <Table
          allRowSelection={true}
          // initialRowSelection={}
          thead={['no', 'zoneId', 'displayName', 'physicalType', 'date', 'alarmNum', 'carrierNum', 'warningNum']}
          // cacheColumnVisibility={columnVisibility}
          // setCacheColumnVisibility={handleVisibility}
          data={renderZone}
          makePagination={true}
          renderSelectComponent={<StatsSummaryGraphic {...statsSummaryGraphicProps} />}
          // onSearch={handleSearchKeyword}
        />
      </div>
    </>
  );
};

export default StatsSummary;
