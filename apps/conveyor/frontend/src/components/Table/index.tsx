import { createLogger } from '@package-frontend/utils';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  getExpandedRowModel,
  getFilteredRowModel,
  Table,
  Row,
  Column,
  VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState, Fragment, ReactElement, ChangeEvent, cloneElement, useEffect } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Button, Checkbox, Input, Numeric, Select, Skeleton } from '@library-frontend/ui';
import { useTranslation } from 'react-i18next';
import Td from './Td';
import Empty from '@/Empty';

/* ======   interface   ====== */
export interface TableProps<T> {
  thead: string[];
  data?: T[];
  allRowSelectTick?: number;
  cacheColumnVisibility?: VisibilityState;
  setCacheColumnVisibility?: (value: VisibilityState) => unknown;
  textAlignCenter?: boolean;
  makePagination?: boolean;
  renderSelectComponent?: ReactElement<{ selectedRows: Row<T>[] }>;
  renderSubComponent?: ReactElement<{ row: Row<T> }>;
  onSearch?: (keyword: string) => Promise<unknown>;
}

/* ======    global     ====== */
const logger = createLogger('components/Table');

const Table = <T,>({
  thead,
  onSearch,
  data,
  allRowSelectTick,
  textAlignCenter = true,
  cacheColumnVisibility,
  setCacheColumnVisibility,
  makePagination = false,
  renderSubComponent,
  renderSelectComponent,
}: TableProps<T>) => {
  if (!data)
    return (
      <Skeleton>
        <div className="w-full h-10"></div>
        <div className="w-full h-10"></div>
        <div className="w-full h-64"></div>
      </Skeleton>
    );
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const pageSizeOptions = [
    { value: '10', label: t('10개씩 보기') },
    { value: '20', label: t('20개씩 보기') },
    { value: '30', label: t('30개씩 보기') },
    { value: '40', label: t('40개씩 보기') },
    { value: '50', label: t('50개씩 보기') },
  ];
  const defaultColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(renderSelectComponent
        ? [
            {
              id: 'select',
              header: ({ table }: { table: Table<T> }) => (
                <div className="text-left">
                  <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </div>
              ),
              cell: ({ row }: { row: Row<T> }) => (
                <div className="text-left">
                  <Checkbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </div>
              ),
            },
          ]
        : []),

      ...thead.map((key) => ({
        accessorKey: key,
        header: key
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .toLowerCase(),
        footer: ({ column }: { column: Column<T> }) => column.id,
      })),
      ...(renderSubComponent
        ? [
            {
              id: 'expander',
              header: () => null,
              cell: ({ row }: { row: Row<T> }) => {
                return row.getCanExpand() ? (
                  <Button
                    themeColor={null}
                    themeSize={null}
                    onClick={row.getToggleExpandedHandler()}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.getIsExpanded() ? '🗁' : '🗀'}
                  </Button>
                ) : (
                  '🔵'
                );
              },
            },
          ]
        : []),
    ],
    [thead, renderSelectComponent, renderSubComponent],
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(cacheColumnVisibility ?? {});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      sorting,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: onSearch ? () => null : setGlobalFilter,
    globalFilterFn: (row, columnId, value, addMeta) => {
      const itemRank = rankItem(row.getValue(columnId), value);
      addMeta({
        itemRank,
      });
      return itemRank.passed;
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: makePagination ? getPaginationRowModel() : undefined,
    onColumnVisibilityChange: cacheColumnVisibility ? setColumnVisibility : undefined,
    debugTable: true,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
  });

  const selectedRows = useMemo(() => {
    return table.getRowModel().rows.filter((row) => rowSelection[row.id]);
  }, [table, rowSelection]);
  /* ======   function    ====== */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (onSearch) onSearch(keyword);
    else setGlobalFilter(keyword);
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    setCacheColumnVisibility && setCacheColumnVisibility(columnVisibility);
  }, [columnVisibility]);
  useEffect(() => {
    logger(allRowSelectTick);
    if (allRowSelectTick) setRowSelection(table.getRowModel().rows.reduce((a, v) => ({ ...a, [v.id]: true }), {}));
  }, [allRowSelectTick]);
  logger('render');
  return (
    <div className="p-4 bg-white shadow rounded-lg space-y-3">
      {cacheColumnVisibility && (
        <div className="border border-gray-300 rounded-lg">
          <div className="px-2 py-1 border-b border-gray-300 bg-gray-100">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />
              <span className="text-gray-700 font-medium">{t('전체 선택')}</span>
            </label>
          </div>
          <div className="px-2 py-1 flex flex-wrap">
            {table.getAllLeafColumns().map((column) => {
              return (
                <label key={column.id} className="m-2">
                  <Checkbox checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()}>
                    <span className="uppercase">
                      {column.id
                        .replace(/([A-Z])/g, ' $1')
                        .trim()
                        .toLowerCase()}
                    </span>
                  </Checkbox>
                </label>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            type="text"
            autoComplete="table-search"
            defaultValue={globalFilter}
            debounceTime={300}
            // debounceTime={onSearch ? 600 : 300}
            onChange={handleSearchChange}
            placeholder="검색어를 입력하세요"
          />
        </div>
        {renderSelectComponent && (
          <div className="flex items-center">{cloneElement(renderSelectComponent, { selectedRows })}</div>
        )}
      </div>
      <div className="mb-4 overflow-y-hidden">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none gap-1' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span>
                            {header.column.getIsSorted() === 'asc' && '🔼'}
                            {header.column.getIsSorted() === 'desc' && '🔽'}
                          </span>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr>
                      {row.getVisibleCells().map((cell) => (
                        <Td textAlignCenter={textAlignCenter} key={cell.id} cell={cell} />
                      ))}
                    </tr>
                    {row.getIsExpanded() && renderSubComponent && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>{cloneElement(renderSubComponent, { row })}</td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={99} className="text-center pt-8 pb-4">
                  <Empty />
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            {renderSelectComponent && (
              <tr>
                <td colSpan={table.getAllFlatColumns().length} className="px-6 py-3 text-sm font-medium text-gray-500">
                  {Object.keys(rowSelection).length} of {table.getPreFilteredRowModel().rows.length} 행이 선택되었습니다
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
      {makePagination && (
        <div>
          <div className="w-fit m-auto flex items-center gap-2">
            <Button
              themeColor="secondary"
              themeSize="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              ❮❮
            </Button>
            <Button
              themeColor="secondary"
              themeSize="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ❮
            </Button>
            <Button
              themeColor="secondary"
              themeSize="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ❯
            </Button>
            <Button
              themeColor="secondary"
              themeSize="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              ❯❯
            </Button>
            <div className="flex items-center gap-1">
              <span>{t('페이지')}</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </div>
            <div className="flex items-center gap-1 max-lg:!hidden">
              | {t('페이지 이동')}:
              <Numeric
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                min={1}
                max={table.getPageCount()}
                maxMessage={() => t('페이지를 벗어나는 수는 입력할 수 없습니다.')}
                minMessage={() => t('페이지를 벗어나는 수는 입력할 수 없습니다.')}
                className="border rounded w-24"
                placeholder="page"
              />
            </div>
            <Select
              className="max-lg:!hidden"
              defaultValue={String(table.getState().pagination.pageSize)}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              options={pageSizeOptions}
            />
          </div>
        </div>
      )}
      <hr />
    </div>
  );
};

export default Table;
