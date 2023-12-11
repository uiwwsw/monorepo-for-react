import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import { Button, Calendar, Checkbox, Tutorial } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
export interface StatsCalendarProps {
  currentDuration: string[];
  onChange: (duration: Dayjs[]) => Promise<unknown>;
}
/* ======    global     ====== */

const logger = createLogger('pages/Stats/Calendar');
const StatsCalendar = ({ currentDuration, onChange }: StatsCalendarProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const fixedCalendar = useRef(storage.get<string[]>(STORAGE['stats/calendar']));
  const checkboxRef = useRef<HTMLInputElement>(null);
  const guides = [
    {
      ref: checkboxRef,
      text: '달력을 고정하면 통계 서머리, 알람, 케리어의 달력이 동기화 됩니다.\n동기화 하지 않으면 각각 오늘부터 1주일전까지의 데이터를 보여줍니다.',
    },
  ];

  /* ======   function    ====== */
  const handleFixedCalendar = (e: ChangeEvent<HTMLInputElement>) => {
    let value: string[] = [];
    if (e.target.checked) {
      value = currentDuration;
    }
    storage.set(STORAGE['stats/calendar'], value);
    fixedCalendar.current = value;
    logger('handleFixedCalendar', value);
  };
  const handleChange = (duration: Dayjs | Dayjs[]) => {
    if (!(duration instanceof Array)) return;
    const arg = [duration[0].toISOString(), duration[1].toISOString()];
    logger(fixedCalendar.current, arg);
    fixedCalendar.current?.length && storage.set(STORAGE['stats/calendar'], arg);
    onChange && onChange(duration);
    logger('handleChange', duration);
  };

  /* ======   useEffect   ====== */
  return (
    <>
      <Tutorial guide={guides} />
      <div className="flex items-center gap-2">
        <span ref={checkboxRef}>
          <Checkbox defaultChecked={!!fixedCalendar.current?.length} onChange={handleFixedCalendar}>
            {t('달력 동기화')}
          </Checkbox>
        </span>
        <Calendar
          defaultValue={currentDuration}
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleChange}
          button={<Button themeColor={'secondary'} themeSize="sm" className="w-[300px]" />}
        />
      </div>
    </>
  );
};

export default StatsCalendar;
