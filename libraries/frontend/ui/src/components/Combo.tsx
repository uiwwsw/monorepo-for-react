import { ChangeEvent, MouseEvent, SelectHTMLAttributes, useMemo, useRef, useState } from 'react';
import Caret from '$/Caret';
import { createLogger } from '@package-frontend/utils';
import Input from './Input';
import Menu from './Menu';
import Button from './Button';
/* ======   interface   ====== */
export interface ComboProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
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
const Combo = ({ placeholder = 'Combo box', defaultValue = '', options = [], error }: ComboProps) => {
  /* ======   variables   ====== */
  const ref = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string>(defaultValue);
  const memoOptions = useMemo(() => options.filter((x) => !x.hidden), [options]);
  const memoSearchOptions = useMemo(() => memoOptions.filter((x) => x.label.includes(search)), [options, search]);
  const label = useMemo(() => options.find((x) => x.value === value)?.label ?? '', [value, options]);
  /* ======   function    ====== */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value);
  const handleClick = (value: string) => setValue(value);
  const handleFinished = () => {
    ref.current!.value = '';
    setSearch('');
  };
  const handleInputClick = (e: MouseEvent) => {
    e.stopPropagation();
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <Menu
      onFinished={handleFinished}
      button={
        <div className="flex items-center relative">
          <Input value={label} readOnly placeholder={placeholder} />
          <Caret className="!w-0 -translate-x-6" />
        </div>
      }
    >
      <Input
        type="search"
        ref={ref}
        error={error}
        placeholder="검색어를 입력하세요."
        onChange={handleChange}
        onClick={handleInputClick}
      />
      <div
        className={`flex flex-col gap-1 after:block after:text-center [&:empty::after]:content-[attr(data-text)]`}
        data-text={memoOptions.length ? '검색결과가 없습니다.' : '비었습니다.'}
      >
        {memoSearchOptions.map((x) => (
          <Button
            themeSize={'xs'}
            disabled={x.disabled}
            themeColor={x.value === value ? 'primary' : 'secondary'}
            onClick={() => handleClick(x.value)}
          >
            {x.label}
          </Button>
        ))}
      </div>
    </Menu>
  );
};
export default Combo;
