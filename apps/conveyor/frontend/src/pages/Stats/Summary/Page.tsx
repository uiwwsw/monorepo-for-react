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

/* ======   interface   ====== */
export type Thead = (typeof thead)[number];

/* ======    global     ====== */
const logger = createLogger('pages/Stats/Summary');
export const thead = [
  'level',
  'zoneId',
  'displayName',
  'physicalType',
  'date',
  'alarmNum',
  'carrierNum',
  'warningNum',
] as const;
const StatsSummary = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const fixHead: Record<Thead, string> = {
    level: t('레벨'),
    zoneId: t('지역 아이디'),
    displayName: t('표시 이름'),
    physicalType: t('물리적 유형'),
    date: t('날짜'),
    alarmNum: t('알람 번호'),
    carrierNum: t('캐리어 번호'),
    warningNum: t('경고 번호'),
  };
  const { pageSizeForSummary, durationForSummary } = useSetting();

  const fixedCalendar = storage.get<string[]>(STORAGE['stats/calendar']);
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
        allRowSelectTick={allRowSelectTick}
        pageSize={pageSizeForSummary}
        thead={[...thead]}
        fixHead={fixHead}
        // cacheColumnVisibility={columnVisibility}
        // setCacheColumnVisibility={handleVisibility}
        data={renderZone}
        makePagination={true}
        renderSelectComponentAtTop={<StatsSummaryGraphic {...statsSummaryGraphicProps} />}
        // onSearch={handleSearchKeyword}
      />
    </>
  );
};

export default StatsSummary;
