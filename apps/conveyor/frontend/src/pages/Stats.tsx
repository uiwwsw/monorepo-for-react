import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Tab } from '@library-frontend/ui';
import { Calendar } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
/* ======    global     ====== */
const tabs = ['가', '나', '다', '라'];
const logger = createLogger('pages/Stats');
const Stats = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([]);
  /* ======   function    ====== */
  const handleChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    setChildren(
      <Calendar
        placeholder={t('날짜를 선택해 주세요.')}
        selectRangeHolder={t('기간을 선택해 주세요.')}
        tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
        selectRange
        onChange={handleChange}
      />,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render');
  return (
    <>
      통계페이지
      <div className="h-60">
        <ChartLine />
      </div>
      <Tab header={tabs}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Tab>
    </>
  );
};

export default Stats;
