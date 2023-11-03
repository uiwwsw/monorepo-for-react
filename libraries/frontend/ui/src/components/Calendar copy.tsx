import { useMemo, useRef, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { Dayjs } from 'dayjs';
import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
import Button from './Button';
import Smooth from './Smooth';
import 'react-calendar/dist/Calendar.css';
import { LooseValue } from 'node_modules/react-calendar/dist/esm/shared/types';
import Portal from './Portal';
import { usePosition } from '#/usePosition';
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setPosition, position } = usePosition({ targetRef: wrapRef });

  const [layer, setLayer] = useState(false);
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
  const handleOpen = () => {
    setLayer(true);
    setPosition();
  };
  const handleChange = (e: unknown) => {
    const value = convertFromValueToDate(e);
    setValue(value);
    onChange && onChange(value);
    setLayer(false);
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div ref={wrapRef} className="inline-flex">
      <Button themeSize="sm" onClick={handleOpen}>
        {memoValueForDisplay}
      </Button>
      <Portal>
        <Smooth style={position} value={layer} data-testid="react-calendar" className="absolute z-10">
          <ReactCalendar defaultValue={defaultValue} selectRange={selectRange} onChange={handleChange} />
        </Smooth>
      </Portal>
    </div>
  );
};

export default Calendar;
