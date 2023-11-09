import { MouseEvent, useMemo, useRef, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { Dayjs } from 'dayjs';
import { FORMAT, FORMAT_WITHOUT_TIME, createLogger, newDate } from '@package-frontend/utils';
import Button from './Button';
import 'react-calendar/dist/Calendar.css';
import { LooseValue } from 'node_modules/react-calendar/dist/esm/shared/types';
import Menu from './Menu';
import Tooltip from './Tooltip';
/* ======   interface   ====== */
export interface CalendarProps {
  placeholder?: string;
  selectRangeHolder?: string;
  tooltipMsg?: string;
  selectRange?: boolean;
  defaultValue?: LooseValue;
  onChange?: (value: Dayjs | Dayjs[]) => void;
}
/* ======    global     ====== */
const convertFromValueToDate = (value: unknown) =>
  value instanceof Array ? value.map((x) => newDate(x)) : newDate(value);
const logger = createLogger('components/Calendar');
const Calendar = ({
  selectRange,
  defaultValue,
  onChange,
  placeholder = '날짜를 선택해주세요.',
  selectRangeHolder = '기간을 선택해 주세요.',
  tooltipMsg = '시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.',
}: CalendarProps) => {
  /* ======   variables   ====== */
  const fakeRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState<undefined | Dayjs | Dayjs[]>(
    defaultValue ? convertFromValueToDate(defaultValue) : undefined,
  );
  const memoValueForDisplay = useMemo(() => {
    if (selectRange)
      return value instanceof Array
        ? `${newDate(value[0]).format(FORMAT_WITHOUT_TIME)} ~ ${newDate(value[1]).format(FORMAT_WITHOUT_TIME)}`
        : selectRangeHolder;
    return value ? `${newDate(value).format(FORMAT)}` : placeholder;
  }, [value]);
  /* ======   function    ====== */
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleChange = (e: unknown) => {
    const value = convertFromValueToDate(e);
    setValue(value);
    fakeRef.current?.click();
    onChange && onChange(value);
  };
  const handleTooltipClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <Menu
      width={300}
      button={
        <Button className="w-[300px]" themeSize="sm">
          {memoValueForDisplay}
          {selectRange && (
            <span className="ml-2">
              <Tooltip onClick={handleTooltipClick}>{tooltipMsg}</Tooltip>
            </span>
          )}
        </Button>
      }
    >
      <i ref={fakeRef} />
      <div onClick={handleClick} aria-label="react-calendar">
        <ReactCalendar defaultValue={defaultValue} selectRange={selectRange} onChange={handleChange} />
      </div>
    </Menu>
  );
};

export default Calendar;
