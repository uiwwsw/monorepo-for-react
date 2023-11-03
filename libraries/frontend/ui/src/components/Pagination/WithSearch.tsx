import { createLogger } from '@package-frontend/utils';
import { ChangeEvent, FocusEvent, MouseEvent, useMemo, useRef, useState } from 'react';
import Pagination, { PaginationProps } from '.';
import Menu from '@/Menu';
import Input from '@/Input';
import Button from '@/Button';
/* ======   interface   ====== */
export interface PaginationWithSearchProps extends PaginationProps {}

/* ======    global     ====== */
const logger = createLogger('components/Pagination/WithSearch');
export default function PaginationWithSearch({ onChange, ...props }: PaginationWithSearchProps) {
  /* ======   variables   ====== */
  const fakeRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const memoIndex = useMemo(() => ((index ?? -1) >= 0 ? index : undefined), [index]);
  /* ======   function    ====== */
  const handleFinished = (value: boolean) => {
    if (!value) return index !== undefined && setIndex(undefined);
    inputRef.current?.focus();
    logger(inputRef);
  };
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const page = +e.currentTarget.value;
    if (isNaN(page)) return;

    setIndex(page - 1);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.value = '';
    fakeRef.current?.click();
  };
  const handlePageChange = (index: number) => {
    setIndex(undefined);
    onChange && onChange(index);
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="w-fit relative z-10">
      <Pagination {...props} onChange={handlePageChange} startPage={memoIndex} />
      <div className="absolute -z-10 ml-2 left-full top-1/2 -translate-y-1/2">
        <Menu
          onFinished={handleFinished}
          button={
            <Button themeSize={null} themeColor={null}>
              🔍
            </Button>
          }
        >
          <i ref={fakeRef} />
          <Input
            ref={inputRef}
            placeholder="원하는 페이지 숫자"
            type="number"
            role="textbox"
            onClick={handleClick}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Menu>
      </div>
    </div>
  );
}
