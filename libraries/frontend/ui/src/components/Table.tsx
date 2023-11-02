import { ChangeEvent, useRef } from 'react';
import Checkbox from '@/Checkbox';
import { WithEval, WithId } from '#/componentTypes';
import Button from './Button';
import { createLogger } from '@package-frontend/utils';
import { Color } from './Color';
import { Size } from './Size';
/* ======   interface   ====== */
export type Tbody = Record<string | number, string | number | boolean> & WithId & { selected?: boolean };
export interface TableProps extends WithEval<string> {
  thead: (string | number)[];
  tbody: Tbody[];
  hasSelect?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Table');
const Table = ({ thead, tbody, hasSelect = true, onEval }: TableProps) => {
  /* ======   variables   ====== */
  let checkboxRefs: NodeListOf<HTMLInputElement> | undefined = undefined;
  const allChkInputRef = useRef<HTMLInputElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  /* ======   function    ====== */
  const handleAllSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (!checkboxRefs) checkboxRefs = tbodyRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxRefs?.forEach((x, i) => {
      x.checked = checked!;
      tbody[i].selected = checked!;
    });
  };
  const handleSelectChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const checked = e.target.checked;
    const allChecked = allChkInputRef.current?.checked;
    tbody[i].selected = checked;

    if (!checked && allChecked) return (allChkInputRef.current.checked = false);

    if (!checkboxRefs) checkboxRefs = tbodyRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    if (checked && !allChecked) {
      let isAllChecked = true;
      for (const each of checkboxRefs!) {
        if (each instanceof HTMLInputElement && !each.checked) {
          isAllChecked = false;
          break;
        }
      }
      isAllChecked && (allChkInputRef.current!.checked = true);
    }
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <table className="bg-white outline outline-1 rounded-md outline-gray-300">
      <thead className="font-bold border-b">
        <tr>
          {hasSelect ? (
            <th className="p-2">
              <Checkbox ref={allChkInputRef} aria-label="Select All" onChange={handleAllSelectChange} />
            </th>
          ) : null}
          {thead.map((head, i) => (
            <th className="p-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider" key={i + 'th'}>
              {head}
            </th>
          ))}
          {onEval ? <th>Action</th> : null}
        </tr>
      </thead>
      <tbody ref={tbodyRef}>
        {tbody.map((row, i) => (
          <tr key={i + 'tr'}>
            {hasSelect ? (
              <td className="p-2">
                <Checkbox defaultChecked={row.selected} onChange={(e) => handleSelectChange(e, i)} />
              </td>
            ) : null}
            {thead.map((head, j) => (
              <td className="p-2 border-gray-300" key={i + j + 'td'}>
                {row[head]}
              </td>
            ))}
            {onEval ? (
              <td className="p-2">
                <Button
                  themeColor={(row['theme'] ?? 'primary') as Color}
                  themeSize={(row['size'] ?? 'md') as Size}
                  onClick={() => onEval(row.id)}
                >
                  Action
                </Button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
