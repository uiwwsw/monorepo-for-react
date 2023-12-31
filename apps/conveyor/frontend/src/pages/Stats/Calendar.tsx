import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
import Test from '@/Test';
import { useTutorialContext } from '@/TutorialContext';
import { Button, Calendar, Checkbox, Emoji, Input, useDebounce } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/* ======   interface   ====== */
export interface StatsCalendarProps {
  currentDuration: string[];
  onChange: (duration: Dayjs[]) => Promise<unknown>;
  onChangeKeyword?: (e: ChangeEvent<HTMLInputElement>) => unknown;
}
/* ======    global     ====== */

const logger = createLogger('pages/Stats/Calendar');
const StatsCalendar = ({ currentDuration, onChange, onChangeKeyword }: StatsCalendarProps) => {
  /* ======   variables   ====== */
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState('');
  const { addGuides } = useTutorialContext();
  const { t } = useTranslation();
  const fixedCalendar = useRef(storage.get<string[]>(STORAGE['stats/calendar']));
  const fixedKeyword = useRef(storage.get<string | undefined>(STORAGE['stats/keyword']));
  const checkboxRef = useRef<HTMLSpanElement>(null);
  const searchBoxRef = useRef<HTMLSpanElement>(null);

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
  const handleChangeCalendar = (duration: Dayjs | Dayjs[]) => {
    if (!(duration instanceof Array)) return;
    const arg = [duration[0].toISOString(), duration[1].toISOString()];
    logger(fixedCalendar.current, arg);
    fixedCalendar.current?.length && storage.set(STORAGE['stats/calendar'], arg);
    onChange && onChange(duration);
    logger('handleChangeCalendar', duration);
  };
  const setCacheKeyword = (value?: string) => {
    storage.set(STORAGE['stats/keyword'], value);
    fixedKeyword.current = value;
  };
  const handleFixedKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    let value: string | undefined;
    if (e.target.checked) value = keyword;
    setCacheKeyword(value);
    logger('handleFixedKeyword', value, keyword);
  };
  const debounceChangeKeyword = useDebounce(onChangeKeyword ? onChangeKeyword : () => {}, 500);
  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword);
    if (fixedKeyword.current !== undefined) setCacheKeyword(keyword);
    logger('handleChangeKeyword', `fixedKeyword.current: ${fixedKeyword.current}`, `keyword:${keyword}`);
    debounceChangeKeyword(e);
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    setKeyword(fixedKeyword.current ?? '');
    setTimeout(() => {
      addGuides([
        {
          ref: checkboxRef,
          text: t(
            '달력을 고정하면 통계 요약, 알람, 케리어의 달력이 동기화 됩니다.\n동기화 하지 않으면 각각 오늘부터 1주일전까지의 데이터를 보여줍니다.',
          ),
        },
        {
          ref: searchBoxRef,
          text: t(
            '검색기능은 필터와 다르게 DB에서 검색합니다. 알람, 케리어 페이지에서 필터 기능이 필요하다면 설정에서 활성화해 주세요.',
          ),
        },
      ]);
    }, 0);
  }, [pathname]);
  useEffect(() => {}, []);
  return (
    <div className="table">
      <div className="table-row">
        <span ref={checkboxRef} className="table-cell pr-8">
          <Checkbox defaultChecked={!!fixedCalendar.current?.length} onChange={handleFixedCalendar}>
            <span className="max-lg:hidden">{t('달력 동기화')}</span>
            <Emoji className="lg:hidden">🗓️</Emoji>
          </Checkbox>
        </span>
        <span className="table-cell">
          <Calendar
            maxRange={60}
            toastMsg={t('60일을 초과할 수 없습니다.')}
            defaultValue={currentDuration}
            placeholder={t('날짜를 선택해 주세요.')}
            selectRangeHolder={t('기간을 선택해 주세요.')}
            tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
            selectRange
            onChange={handleChangeCalendar}
            button={<Button themeColor={'secondary'} themeSize="sm" />}
          />
        </span>
      </div>
      {onChangeKeyword && (
        <div className="table-row">
          <span className="table-cell">
            <Checkbox defaultChecked={!!fixedKeyword.current} onChange={handleFixedKeyword}>
              <span className="max-lg:hidden">{t('검색어 동기화')}</span>
              <Emoji className="lg:hidden">🔎</Emoji>
            </Checkbox>
          </span>
          <span className="table-cell" ref={searchBoxRef}>
            <Test className="left-32">
              <Input
                type="search"
                className="max-lg:w-32"
                value={keyword}
                placeholder={t('검색어를 입력하세요.')}
                onChange={handleChangeKeyword}
              />
            </Test>
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCalendar;
