import { createLogger } from '@package-frontend/utils';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Arrow from './Arrow';
import Numeric, { InputNumericProps } from '@/Input/Numeric';

/* ======   interface   ====== */
export interface PaginationProps {
  max: number;
  index?: number;
  per?: number;
  onChange?: (page: number) => unknown;
  onChangePer?: (per: number) => unknown;
  maxMessage?: InputNumericProps['maxMessage'];
  minMessage?: InputNumericProps['minMessage'];
  placeholder?: string;
}

/* ======    global     ====== */

const logger = createLogger('components/Pagination');
export default function Pagination({
  per = 10,
  onChange,
  max,
  index = 0,
  maxMessage,
  minMessage,
  onChangePer,
  placeholder,
}: PaginationProps) {
  /* ======   variables   ====== */
  const [currentPage, setCurrentPage] = useState(index + 1);
  const inputPage = useMemo(() => (currentPage > max || currentPage < 1 ? 0 : currentPage), [currentPage, max]);
  const disabledRightArrow = useMemo(() => currentPage >= max, [currentPage, max]);
  const disabledLeftArrow = useMemo(() => currentPage <= 1, [currentPage]);
  const disabled = max === 0;
  /* ======   function    ====== */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleClick(+e.target.value);
    logger('handleChange');
  };
  const handleChangePer = (e: ChangeEvent<HTMLInputElement>) => {
    onChangePer && onChangePer(+e.target.value);
    logger('handleChangePer');
  };
  const handleClick = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      onChange && onChange(newPage - 1);
      logger('handleClick');
    },
    [max, setCurrentPage, onChange],
  );
  const handleLeftArrowClick = useCallback(() => handleClick(currentPage - 1), [handleClick, currentPage]);
  const handleRightArrowClick = useCallback(() => handleClick(currentPage + 1), [handleClick, currentPage]);
  const handleLeftDbArrowClick = useCallback(() => handleClick(1), [handleClick]);
  const handleRightDbArrowClick = useCallback(() => handleClick(max), [handleClick, max]);

  /* ======   useEffect   ====== */
  useEffect(() => {
    const newValue = index + 1;
    logger('useEffect');
    if (newValue !== currentPage) setCurrentPage(index + 1);
  }, [index]);
  return (
    <div className="w-fit m-auto flex items-center gap-2">
      <Arrow onClick={handleLeftDbArrowClick} disabled={disabledLeftArrow}>
        ❮❮
      </Arrow>
      <Arrow onClick={handleLeftArrowClick} disabled={disabledLeftArrow}>
        ❮
      </Arrow>
      <Arrow onClick={handleRightArrowClick} disabled={disabledRightArrow}>
        ❯
      </Arrow>
      <Arrow onClick={handleRightDbArrowClick} disabled={disabledRightArrow}>
        ❯❯
      </Arrow>

      <div className="flex items-center gap-2">
        <span className="w-20 [&>*]:w-full">
          <Numeric
            value={inputPage}
            disabled={disabled}
            onChange={handleChange}
            max={max}
            min={1}
            maxMessage={maxMessage}
            minMessage={minMessage}
            className="border rounded w-24"
            placeholder="page"
          />
        </span>
        <span>/</span>
        <span>{max}</span>
      </div>

      {onChangePer && (
        <Numeric
          debounceTime={300}
          max={100}
          min={1}
          placeholder={placeholder}
          className="max-lg:!hidden"
          onChange={handleChangePer}
          defaultValue={per}
        />
      )}
    </div>
  );
}
