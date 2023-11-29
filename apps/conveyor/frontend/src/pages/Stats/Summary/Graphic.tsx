import ChartLine from '@/Chart/Line';
import { createLogger, newDate } from '@package-frontend/utils';
import { useTranslation } from 'react-i18next';
import { LineProps } from '@nivo/line';
import { Row } from '@tanstack/react-table';
import { StatsSummaryDataRow } from '!/stats/domain';
import { useMemo } from 'react';

/* ======   interface   ====== */

export interface StatsSummaryGraphicProps<T> {
  statsData?: StatsSummaryDataRow[];
  selectedRows?: Row<T>[];
}
/* ======    global     ====== */
const logger = createLogger('pages/Stats/Summary/Graphic');

const StatsSummaryGraphic = <T,>({ statsData, selectedRows }: StatsSummaryGraphicProps<T>) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const length = selectedRows?.length;
  const currentZones = selectedRows?.map((r) => statsData?.[+r.id]);
  const zoneId = currentZones?.map((x) => x?.zoneId).join(',') || t('선택된 행이 없습니다.');
  const carrierTotal = currentZones?.reduce((a, v) => a + (v?.carrierNum ?? 0), 0);
  const carrierAverage = Math.floor(!carrierTotal || !length ? 0 : carrierTotal / length);
  const alarmTotal = currentZones?.reduce((a, v) => a + (v?.alarmNum ?? 0), 0);
  const alarmAverage = Math.floor(!alarmTotal || !length ? 0 : alarmTotal / length);
  const graphData: LineProps['data'] = useMemo(() => {
    if (!currentZones) return [];
    const alarmData: Record<string, number> = {};
    const carrierData: Record<string, number> = {};

    currentZones
      .filter((zone) => zone?.date)
      .sort((a, b) => newDate(a!.date).diff(b!.date))
      .forEach((zone) => {
        if (!zone) return;
        const { date, alarmNum, carrierNum } = zone;
        alarmData[date] = (alarmData[date] ?? 0) + (alarmNum ?? 0);
        carrierData[date] = (carrierData[date] ?? 0) + (carrierNum ?? 0);
      });
    logger(alarmData, carrierData);
    return [
      { id: 'alarm', data: Object.entries(alarmData).map(([key, value]) => ({ x: key, y: value })) },
      { id: 'carrier', data: Object.entries(carrierData).map(([key, value]) => ({ x: key, y: value })) },
    ];
  }, [statsData, selectedRows]);

  /* ======   function    ====== */
  // const handleCalenderChange = async (duration: Dayjs | Dayjs[]) => {
  //   if (!(duration instanceof Array)) return;
  //   const arg: SearchZoneArg = {
  //     begin_date: duration[0].toISOString(),
  //     end_date: duration[1].toISOString(),
  //   };

  //   await Promise.all([setArg(arg)]);
  //   mutate();
  // };

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

  // const rearrangeData = (data: StatsSummaryGraphicDataRow[]) => {
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

  logger('render', selectedRows);
  return (
    <div className="absolute top-4 left-0 w-full bg-white">
      <div className="h-60 flex rounded-xl border mb-3">
        <div className="h-full w-1/5 p-1 border-r-2 pt-4 flex flex-col gap-1">
          <dl className="flex-1 gap-2 items-center flex w-full bg-slate-300 rounded-md p-1">
            <dt className="whitespace-nowrap text-sm">{t('Zone ID')}:</dt>
            <dd title={zoneId} className="truncate font-semibold">
              {zoneId}
            </dd>
          </dl>
          <dl className="flex-1 gap-2 items-center flex w-full bg-slate-300 rounded-md p-1">
            <dt className="whitespace-nowrap text-sm">{t('Carrier Total')}:</dt>
            <dd className="truncate font-semibold">{carrierTotal}</dd>
          </dl>
          <dl className="flex-1 gap-2 items-center flex w-full bg-slate-300 rounded-md p-1">
            <dt className="whitespace-nowrap text-sm">{t('Carrier Average')}:</dt>
            <dd className="truncate font-semibold">{carrierAverage}</dd>
          </dl>
          <dl className="flex-1 gap-2 items-center flex w-full bg-slate-300 rounded-md p-1">
            <dt className="whitespace-nowrap text-sm">{t('Alarm Total')}:</dt>
            <dd className="truncate font-semibold">{alarmTotal}</dd>
          </dl>
          <dl className="flex-1 gap-2 items-center flex w-full bg-slate-300 rounded-md p-1">
            <dt className="whitespace-nowrap text-sm">{t('Alarm Average')}:</dt>
            <dd className="truncate font-semibold">{alarmAverage}</dd>
          </dl>
        </div>
        <div className="h-full w-4/5">
          <ChartLine data={graphData} />
        </div>
      </div>
    </div>
  );
};

export default StatsSummaryGraphic;
