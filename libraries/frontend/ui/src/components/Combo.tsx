import { ChangeEvent, MouseEvent, useMemo, useRef, useState } from 'react';
import Caret from '$/Caret';
import { createLogger } from '#/logger';
import Input from './Input';
import Menu from './Menu';
import Button from './Button';
import Underbar from '$/Underbar';
/* ======   interface   ====== */
export interface ComboProps {
  error?: boolean;
  emptyResult?: string;
  emptyOptions?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  options?: {
    value: string;
    label: string;
    disabled?: boolean;
    hidden?: boolean;
  }[];
  defaultValue?: string;
}
/* ======    global     ====== */
const logger = createLogger('components/Combo');
const Combo = ({
  emptyResult = '검색결과가 없습니다.',
  emptyOptions = '비었습니다.',
  onChange,
  placeholder = 'Combo box',
  searchPlaceholder = '검색어를 입력하세요.',
  defaultValue = '',
  options = [],
  error,
}: ComboProps) => {
  /* ======   variables   ====== */
  const ref = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string>(defaultValue);
  const memoOptions = useMemo(() => options.filter((x) => !x.hidden), [options]);
  const memoSearchOptions = useMemo(() => memoOptions.filter((x) => x.label.includes(search)), [options, search]);
  const label = useMemo(() => options.find((x) => x.value === value)?.label ?? '', [value, options]);
  /* ======   function    ====== */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value);
  const handleClick = (value: string) => {
    setValue(value);
    onChange && onChange(value);
  };
  const handleFinished = () => {
    ref.current!.value = '';
    setSearch('');
  };
  const handleInputClick = (e: MouseEvent) => e.stopPropagation();
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <Menu
      onFinished={handleFinished}
      zIndex={50}
      button={
        <Input
          value={label}
          readOnly
          placeholder={placeholder}
          slots={
            <>
              <Caret error={error} />
              <Underbar error={error} />
            </>
          }
        />
      }
    >
      <div className="bg-white shadow-2xl">
        <Input
          type="search"
          ref={ref}
          error={error}
          placeholder={searchPlaceholder}
          onChange={handleChange}
          onClick={handleInputClick}
          role="search"
        />
        <div
          role="list"
          className="flex flex-col gap-1 after:block after:text-center [&:empty::after]:content-[attr(data-text)]"
          data-text={memoOptions.length ? emptyResult : emptyOptions}
        >
          {memoSearchOptions.map((x) => (
            <Button
              key={x.label}
              themeSize="sm"
              disabled={x.disabled}
              themeColor={x.value === value ? 'primary' : 'secondary'}
              onClick={() => handleClick(x.value)}
            >
              {x.label}
            </Button>
          ))}
        </div>
      </div>
    </Menu>
  );
};
export default Combo;
