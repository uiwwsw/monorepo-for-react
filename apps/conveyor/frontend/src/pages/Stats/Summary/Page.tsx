import { useHeaderContext } from '@/HeaderContext';
import { ToastWithPortal } from '@library-frontend/ui';
import { LocalStorage, createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useZoneStats, Arg } from '!/stats/application/get-zone-stats';
import { useZoneList } from '!/stats/application/get-zone-list';
import Table from '@/Table';
import StatsSummaryGraphic, { StatsSummaryGraphicProps } from './Graphic';
import StatsCalendar from '../Calendar';
import { STORAGE } from '!/storage/domain';

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
const logger = createLogger('pages/Stats/Summary');
// const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2 text-md';
// const colClassName = 'flex-auto justify-center';
// const pagePerCount = 30;

const StatsSummary = () => {
  /* ======   variables   ====== */
  const fixedCalendar = LocalStorage.get<string[]>(STORAGE['stats/calendar']);
  const { setChildren } = useHeaderContext();
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-7, 'day']).second(0).millisecond(0).toISOString(),
    end_time: fixedCalendar?.[1] ?? newDate().second(0).millisecond(0).toISOString(),
  });
  const currentDuration = useMemo(() => [arg.start_time, arg.end_time], [arg]);
  const [allRowSelectTick, setAllRowSelectTick] = useState(1);
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
  const handleCalenderChange = async (duration: Dayjs[]) => {
    if (!(duration instanceof Array)) return;
    logger(fixedCalendar, arg);

    await Promise.all([
      setArg({
        start_time: duration[0].toISOString(),
        end_time: duration[1].toISOString(),
      }),
    ]);

    await mutate();
    setAllRowSelectTick((prev) => prev + 1);
  };

  useEffect(() => {
    setChildren(<StatsCalendar currentDuration={currentDuration} onChange={handleCalenderChange} />);
    return () => setChildren(undefined);
  }, [currentDuration]);
  logger('render');
  return (
    <>
      <ToastWithPortal open={statsError?.message}>{statsError?.message}</ToastWithPortal>
      <ToastWithPortal open={zoneError?.message}>{zoneError?.message}</ToastWithPortal>

      <div className="relative pt-80">
        {/* <StatsSummaryGraphic {...statsSummaryGraphicProps} /> */}
        <Table
          allRowSelectTick={allRowSelectTick}
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