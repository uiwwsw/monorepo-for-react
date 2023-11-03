import { MouseEvent, useMemo, useRef, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { Dayjs } from 'dayjs';
import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
import Button from './Button';
import 'react-calendar/dist/Calendar.css';
import { LooseValue } from 'node_modules/react-calendar/dist/esm/shared/types';
import Menu from './Menu';
/* ======   interface   ====== */
export interface CalendarProps {
  selectRange?: boolean;
  defaultValue?: LooseValue;
  onChange?: (value: Dayjs | Dayjs[]) => void;
}
/* ======    global     ====== */
const convertFromValueToDate = (value: unknown) =>
  value instanceof Array ? value.map((x) => newDate(x)) : newDate(value);
const logger = createLogger('components/Calendar');
const Calendar = ({ selectRange, defaultValue, onChange }: CalendarProps) => {
  /* ======   variables   ====== */
  const fakeRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState<undefined | Dayjs | Dayjs[]>(
    defaultValue ? convertFromValueToDate(defaultValue) : undefined,
  );
  const memoValueForDisplay = useMemo(() => {
    if (selectRange)
      return value instanceof Array
        ? `${newDate(value[0]).format(FORMAT)} ~ ${newDate(value[1]).format(FORMAT)}`
        : '기간을 선택해 주세요.';
    return value ? `${newDate(value).format(FORMAT)}` : '날짜를 선택해주세요.';
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
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <Menu
      width={300}
      button={
        <Button className="w-[300px]" themeSize="sm">
          {memoValueForDisplay}
        </Button>
      }
    >
      <i ref={fakeRef} />
      <div onClick={handleClick}>
        <ReactCalendar defaultValue={defaultValue} selectRange={selectRange} onChange={handleChange} />
      </div>
    </Menu>
  );
};

export default Calendar;
