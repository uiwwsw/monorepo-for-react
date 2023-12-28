import { Button, Emoji } from '@library-frontend/ui';
import { Row } from '@tanstack/react-table';
/* ======   interface   ====== */
export interface ExtenderProps<T> {
  row: Row<T>;
}
/* ======    global     ====== */
// const logger = createLogger('components/Table/Extender');
const Extender = <T,>({ row }: ExtenderProps<T>) => {
  /* ======   variables   ====== */
  const isExpanded = row.getIsExpanded();
  const handler = row.getToggleExpandedHandler();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    row.getCanExpand() && (
      <Button themeColor={null} themeSize="xl" onClick={handler}>
        <Emoji>{isExpanded ? '📂' : '📁'}</Emoji>
      </Button>
    )
  );
};

export default Extender;
