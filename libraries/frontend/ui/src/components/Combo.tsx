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
const Combo = ({ placeholder = 'Combo box', defaultValue = '', options = [] }: ComboProps) => {
  /* ======   variables   ====== */
  const ref = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string>(defaultValue);
  const label = useMemo(() => options.find((x) => x.value === value)?.label ?? '', [value]);
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
        placeholder="검색어를 입력하세요."
        onChange={handleChange}
        onClick={handleInputClick}
      />
      <div
        className={`flex flex-col gap-1 after:block after:text-center [&:empty::after]:content-['검색결과가_없습니다.']`}
      >
        {options
          .filter((x) => x.label.includes(search))
          .map((x) => (
            <Button
              themeSize={'xs'}
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
