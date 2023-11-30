import { MouseEvent, ReactElement, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { Dayjs } from 'dayjs';
import { FORMAT_WITHOUT_TIME, createLogger, newDate } from '@package-frontend/utils';
import 'react-calendar/dist/Calendar.css';
import Menu from './Menu';
import Tooltip from './Tooltip';
import Button from './Button';
/* ======   interface   ====== */
export interface CalendarProps {
  placeholder?: string;
  selectRangeHolder?: string;
  tooltipMsg?: string;
  selectRange?: boolean;
  defaultValue?: string | string[];
  onChange?: (value: Dayjs | Dayjs[]) => void;
  button?: ReactElement;
}
/* ======    global     ====== */
const convertFromValueToDate = (value: CalendarProps['defaultValue']) =>
  value instanceof Array ? value.map((x) => newDate(`${x}`)) : newDate(`${value}`);
const logger = createLogger('components/Calendar');
const Calendar = ({
  button = <Button className="w-[300px]" themeSize="sm" themeColor="primary"></Button>,
  selectRange,
  defaultValue,
  onChange,
  placeholder = '날짜를 선택해주세요.',
  selectRangeHolder = '기간을 선택해 주세요.',
  tooltipMsg = '00시 00분 00초 ~ 23시 59분 59초는 생략됩니다.',
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
    if (value instanceof Array) return;

    return value ? `${newDate(value).format(FORMAT_WITHOUT_TIME)}` : placeholder;
  }, [value]);
  /* ======   function    ====== */
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleChange = (e: unknown) => {
    const value = convertFromValueToDate(e as CalendarProps['defaultValue']);
    setValue(value);
    fakeRef.current?.click();
    onChange && onChange(value);
  };
  const handleTooltipClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    setValue(defaultValue ? convertFromValueToDate(defaultValue) : undefined);
  }, [defaultValue]);
  logger('render');
  return (
    <Menu
      width="300px"
      button={cloneElement(button, {
        children: (
          <span className="flex w-fit m-auto items-center">
            <span className="whitespace-nowrap">{memoValueForDisplay}</span>
            {selectRange && (
              <span className="ml-2">
                <Tooltip onClick={handleTooltipClick}>{tooltipMsg}</Tooltip>
              </span>
            )}
          </span>
        ),
      })}
    >
      <i ref={fakeRef} />
      <div onClick={handleClick} aria-label="react-calendar">
        <ReactCalendar
          value={value as any}
          defaultValue={defaultValue as any}
          selectRange={selectRange}
          onChange={handleChange}
        />
      </div>
    </Menu>
  );
};

export default Calendar;
