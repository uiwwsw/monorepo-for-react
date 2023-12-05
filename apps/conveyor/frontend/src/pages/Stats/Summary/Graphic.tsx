import ChartLine from '@/Chart/Line';
import { createLogger } from '#/logger';
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
  const zoneId = useMemo(() => {
    const length = currentZones?.length ?? 0;
    const currentZoneId = currentZones?.find((x) => x?.zoneId !== undefined)?.zoneId;
    if (length === 0 || !currentZoneId) return t('선택된 행이 없습니다.');

    if (length === 1) return `${currentZoneId}`;

    return t('{{id}} 외 {{length}}개', { id: currentZoneId, length: length - 1 });
  }, [selectedRows]);
  const carrierTotal = currentZones?.reduce((a, v) => a + (v?.carrierNum ?? 0), 0);
  const carrierAverage = Math.floor(!carrierTotal || !length ? 0 : carrierTotal / length);
  const alarmTotal = currentZones?.reduce((a, v) => a + (v?.alarmNum ?? 0), 0);
  const alarmAverage = Math.floor(!alarmTotal || !length ? 0 : alarmTotal / length);
  const graphData: LineProps['data'] = useMemo(() => {
    if (!currentZones) return [];
    const alarm: { x: string; y: number }[] = [];
    const carrier: { x: string; y: number }[] = [];
    const dataAggregator: Record<string, { alarm: number; carrier: number }> = {};

    currentZones.forEach((zone) => {
      if (!zone || !zone.date) return;
      const { date, alarmNum, carrierNum } = zone;

      if (!dataAggregator[date]) dataAggregator[date] = { alarm: 0, carrier: 0 };

      dataAggregator[date].alarm += alarmNum ?? 0;
      dataAggregator[date].carrier += carrierNum ?? 0;
    });
    Object.keys(dataAggregator)
      .sort()
      .forEach((date) => {
        alarm.push({ x: date, y: dataAggregator[date].alarm });
        carrier.push({ x: date, y: dataAggregator[date].carrier });
      });

    return [
      { id: 'alarm', data: alarm },
      { id: 'carrier', data: carrier },
    ];
  }, [statsData, selectedRows]);
  // const graphData: LineProps['data'] = useMemo(() => {
  //   if (!currentZones) return [];
  //   const alarmData: Record<string, number> = {};
  //   const carrierData: Record<string, number> = {};

  //   currentZones
  //     .filter((zone) => zone?.date)
  //     .sort((a, b) => newDate(a!.date).diff(b!.date))
  //     .forEach((zone) => {
  //       if (!zone) return;
  //       const { date, alarmNum, carrierNum } = zone;
  //       alarmData[date] = (alarmData[date] ?? 0) + (alarmNum ?? 0);
  //       carrierData[date] = (carrierData[date] ?? 0) + (carrierNum ?? 0);
  //     });
  //   logger(alarmData, carrierData);
  //   return [
  //     { id: 'alarm', data: Object.entries(alarmData).map(([key, value]) => ({ x: key, y: value })) },
  //     { id: 'carrier', data: Object.entries(carrierData).map(([key, value]) => ({ x: key, y: value })) },
  //   ];
  // }, [statsData, selectedRows]);

  /* ======   function    ====== */

  /* ======   useEffect   ====== */

  logger('render');
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
