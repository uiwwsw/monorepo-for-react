import { useHeaderContext } from '@/HeaderContext';
import { ToastWithPortal } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useZoneStats, Arg } from '!/stats/application/get-zone-stats';
import { useZoneList } from '!/stats/application/get-zone-list';
import Table from '@/Table';
import StatsSummaryGraphic, { StatsSummaryGraphicProps } from './Graphic';
import StatsCalendar from '../Calendar';
import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import H1 from '@/Typography/H1';
import { useTranslation } from 'react-i18next';
import useSetting from '#/useSetting';
import { VisibilityState } from '@tanstack/react-table';
import { TheadSummary, fixHeadSummary, mustHaveColumnSummary } from '!/stats/domain';

/* ======   interface   ====== */

/* ======    global     ====== */
const logger = createLogger('pages/Stats/Summary');

const StatsSummary = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { pageSizeForSummary, durationForSummary, columnForSummary } = useSetting();

  const fixedCalendar = storage.get<string[]>(STORAGE['stats/calendar']);
  const fixedColumn = storage.get<VisibilityState>(STORAGE['stats/summary/column']) ?? {};
  const thead = Object.entries(columnForSummary)
    .filter(([_, val]) => val)
    .map(([key]) => key) as TheadSummary[];
  const { setChildren } = useHeaderContext();
  const [arg, setArg] = useState<Arg>({
    start_time: fixedCalendar?.[0] ?? newDate([-durationForSummary, 'day']).second(0).millisecond(0).toISOString(),
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
        // if (!currentZoneList) return;
        const { displayName, level, physicalType, zoneId } = currentZoneList ?? {};
        return {
          ...x,
          // ...currentZoneList,
          displayName: displayName ?? '',
          level: level ?? '',
          physicalType: physicalType ?? '',
          zoneId: zoneId ?? '',
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
  const handleVisibility = async (value: VisibilityState) => {
    storage.set(STORAGE['stats/summary/column'], value);
    logger('handleVisibility', value);
  };
  const handleCalenderChange = async (duration: Dayjs[]) => {
    if (!(duration instanceof Array)) return;

    await Promise.all([
      setArg({
        start_time: duration[0].toISOString(),
        end_time: duration[1].toISOString(),
      }),
    ]);

    await mutate();
    setAllRowSelectTick((prev) => prev + 1);
    logger('handleCalenderChange', duration);
  };

  useEffect(() => {
    setChildren(<StatsCalendar currentDuration={currentDuration} onChange={handleCalenderChange} />);
    logger('useEffect');

    return () => setChildren(undefined);
  }, [currentDuration]);
  return (
    <>
      <ToastWithPortal open={statsError?.message}>{statsError?.message}</ToastWithPortal>
      <ToastWithPortal open={zoneError?.message}>{zoneError?.message}</ToastWithPortal>

      <H1>{t('요약')}</H1>
      {/* <StatsSummaryGraphic {...statsSummaryGraphicProps} /> */}
      <Table
        mustHaveColumn={mustHaveColumnSummary}
        allRowSelectTick={allRowSelectTick}
        pageSize={pageSizeForSummary}
        thead={thead}
        fixHead={fixHeadSummary}
        cacheColumnVisibility={fixedColumn}
        setCacheColumnVisibility={handleVisibility}
        data={renderZone}
        makePagination={true}
        renderSelectComponentAtTop={<StatsSummaryGraphic {...statsSummaryGraphicProps} />}
        // onSearch={handleSearchKeyword}
      />
    </>
  );
};

export default StatsSummary;
