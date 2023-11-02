import { createLogger } from '@package-frontend/utils';
import { useCallback, useMemo, useState } from 'react';
import PaginationArrow from './Arrow';
/* ======   interface   ====== */
interface PaginationProps {
  totalPageNum: number;
  currentPageIndex?: number;
  maxPageNum?: number;
  onChange: (page: number) => void;
  hasDoubleArrow?: boolean; //doubleArrow 사용할지 결정
}

/* ======    global     ====== */
const logger = createLogger('components/Pagination');
export default function Pagination({
  onChange,
  totalPageNum,
  maxPageNum = 5,
  currentPageIndex = 0,
  hasDoubleArrow,
}: PaginationProps) {
  /* ======   variables   ====== */

  const [currentPage, setCurrentPage] = useState<number>(currentPageIndex);
  const startPage = useMemo(() => Math.floor(currentPage / maxPageNum) * maxPageNum + 1, [maxPageNum, currentPage]);

  const displayPages = useMemo(
    () =>
      Array.from(
        { length: Math.min(startPage + maxPageNum - 1, totalPageNum) - startPage + 1 },
        (_, i) => startPage + i,
      ),
    [totalPageNum, maxPageNum, startPage],
  );
  const disabledRightArrow = useMemo(
    () => startPage + maxPageNum > totalPageNum,
    [startPage, maxPageNum, totalPageNum],
  );
  const disabledLeftArrow = useMemo(() => startPage - maxPageNum <= 0, [startPage, maxPageNum]);
  const disabledRightDbArrow = useMemo(() => currentPage === totalPageNum - 1, [currentPage]);
  const disabledLeftDbArrow = useMemo(() => currentPage === 0, [currentPage]);
  /* ======   function    ====== */
  const handleClick = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage > totalPageNum) return;
      setCurrentPage(newPage);
      onChange(newPage);
    },
    [totalPageNum, setCurrentPage, onChange],
  );
  const handleLeftArrowClick = useCallback(() => handleClick(startPage - 2), [handleClick, startPage]);
  const handleRightArrowClick = useCallback(
    () => handleClick(startPage + maxPageNum - 1),
    [handleClick, startPage, maxPageNum],
  );
  const handleLeftDbArrowClick = useCallback(() => handleClick(0), [handleClick]);
  const handleRightDbArrowClick = useCallback(() => handleClick(totalPageNum - 1), [handleClick, totalPageNum]);

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex justify-center">
      {hasDoubleArrow && (
        <PaginationArrow disabled={disabledLeftDbArrow} onClick={handleLeftDbArrowClick}>
          ❮❮
        </PaginationArrow>
      )}
      <PaginationArrow disabled={disabledLeftArrow} onClick={handleLeftArrowClick}>
        ❮
      </PaginationArrow>
      <div className="flex justify-center mx-2">
        {displayPages.map((pageNumber) => (
          <div
            key={pageNumber}
            onClick={() => handleClick(pageNumber - 1)}
            className={`text-center px-3.5 py-2 border ${
              pageNumber === currentPage + 1 ? 'bg-indigo-500 text-white' : 'hover:bg-gray-300 cursor-pointer'
            }`}
          >
            {pageNumber}
          </div>
        ))}
      </div>
      <PaginationArrow disabled={disabledRightArrow} onClick={handleRightArrowClick}>
        ❯
      </PaginationArrow>
      {hasDoubleArrow && (
        <PaginationArrow disabled={disabledRightDbArrow} onClick={handleRightDbArrowClick}>
          ❯❯
        </PaginationArrow>
      )}
    </div>
  );
}
