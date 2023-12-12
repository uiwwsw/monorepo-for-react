import { emptyClassName } from '@/Empty';
import { Cell, flexRender } from '@tanstack/react-table';
import { TableProps } from '.';
/* ======   interface   ====== */
export interface TdProps<T> {
  textAlignCenter?: TableProps<T>['textAlignCenter'];
  cell: Cell<T, unknown>;
}
/* ======    global     ====== */
// const logger = createLogger('components/Table/Td');
const Td = <T,>({ cell, textAlignCenter }: TdProps<T>) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <td className={`px-6 py-4 truncate text-sm align-middle${textAlignCenter ? ` text-center` : ''} ${emptyClassName}`}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

export default Td;
