import { createLogger } from '@package-frontend/utils';
import { ChangeEvent, FocusEvent, MouseEvent, useMemo, useRef, useState } from 'react';
import Pagination, { PaginationProps } from '.';
import Menu from '@/Menu';
import Input from '@/Input';
import Button from '@/Button';
import { nextTick } from 'process';
/* ======   interface   ====== */
interface PaginationWithMenuProps extends PaginationProps {}

/* ======    global     ====== */
const logger = createLogger('components/Pagination/WithMenu');
export default function PaginationWithMenu(props: PaginationWithMenuProps) {
  /* ======   variables   ====== */
  const fakeRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const memoIndex = useMemo(() => ((index ?? -1) >= 0 ? index : undefined), [index]);
  /* ======   function    ====== */
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
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="w-fit relative m-auto">
      <Pagination {...props} startPage={memoIndex} />
      <div className="absolute ml-2 left-full top-1/2 -translate-y-1/2">
        <Menu
          button={
            <Button themeSize={null} themeColor={null}>
              🔍
            </Button>
          }
        >
          <i ref={fakeRef} />
          <Input onClick={handleClick} onChange={handleChange} onBlur={handleBlur} />
        </Menu>
      </div>
    </div>
  );
}
