import { isDateString } from '#/renderObject';
import { emptyClassName } from '@/Empty';
import { FORMAT, createLogger, newDate } from '@package-frontend/utils';
import { Cell, flexRender } from '@tanstack/react-table';
/* ======   interface   ====== */
export interface TdProps<T> {
  cell: Cell<T, unknown>;
}
/* ======    global     ====== */
const logger = createLogger('components/Table/Td');
const Td = <T,>({ cell }: TdProps<T>) => {
  /* ======   variables   ====== */
  const context = cell.getContext();
  const strRender = context.getValue();
  const render = flexRender(cell.column.columnDef.cell, context);
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render', strRender, render);
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm align-middle ${emptyClassName}`}>
      {isDateString(`${strRender}`) ? newDate(`${strRender}`).format(FORMAT) : render}
    </td>
  );
};

export default Td;
