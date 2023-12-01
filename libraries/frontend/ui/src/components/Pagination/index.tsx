import { createLogger } from '@package-frontend/utils';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Arrow from './Arrow';
import Numeric, { InputNumericProps } from '@/Input/Numeric';
import Select, { SelectProps } from '@/Select';

/* ======   interface   ====== */
export interface PaginationProps {
  sizeOptions?: SelectProps['options'];
  max: number;
  index?: number;
  per?: number;
  onChange?: (page: number) => unknown;
  onChangePer?: (per: number) => unknown;
  maxMessage?: InputNumericProps['maxMessage'];
  minMessage?: InputNumericProps['minMessage'];
}

/* ======    global     ====== */
const pageSizeOptions = [
  { value: '10', label: '10개씩 보기' },
  { value: '20', label: '20개씩 보기' },
  { value: '30', label: '30개씩 보기' },
  { value: '40', label: '40개씩 보기' },
  { value: '50', label: '50개씩 보기' },
];
const logger = createLogger('components/Pagination');
export default function Pagination({
  per = 10,
  onChange,
  sizeOptions = pageSizeOptions,
  max,
  index = 0,
  maxMessage,
  minMessage,
  onChangePer,
}: PaginationProps) {
  /* ======   variables   ====== */
  const [currentPage, setCurrentPage] = useState(index + 1);
  const disabledRightArrow = useMemo(() => currentPage >= max, [currentPage, max]);
  const disabledLeftArrow = useMemo(() => currentPage <= 1, [currentPage]);
  /* ======   function    ====== */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleClick(+e.target.value);
  const handleChangePer = (e: ChangeEvent<HTMLSelectElement>) => onChangePer && onChangePer(+e.target.value);
  const handleClick = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      onChange && onChange(newPage - 1);
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
    if (newValue !== currentPage) setCurrentPage(index + 1);
  }, [index]);
  logger('render');
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
            value={currentPage}
            onChange={handleChange}
            max={max}
            min={1}
            maxMessage={maxMessage}
            minMessage={minMessage}
            className="border rounded w-24"
            placeholder="page"
          />
        </span>
        <span>of</span>
        <span>{max}</span>
      </div>

      {onChangePer && (
        <Select className="max-lg:!hidden" onChange={handleChangePer} defaultValue={per} options={sizeOptions} />
      )}
    </div>
  );
}
