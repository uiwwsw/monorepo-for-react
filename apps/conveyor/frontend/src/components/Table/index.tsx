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
import { Button, Checkbox, Input, Pagination, Skeleton } from '@library-frontend/ui';
import { useTranslation } from 'react-i18next';
import Td from './Td';
import Empty from '@/Empty';
import { pageSizeOptions } from '#/constants';
import useSetting from '#/useSetting';
import Test from '@/Test';

/* ======   interface   ====== */
export interface TableProps<T> {
  thead: string[];
  placeholder?: string;
  fixHead?: Record<string, string>;
  data?: T[];
  allRowSelectTick?: number;
  cacheColumnVisibility?: VisibilityState;
  setCacheColumnVisibility?: (value: VisibilityState) => unknown;
  textAlignCenter?: boolean;
  makePagination?: boolean;
  renderSelectComponentAtTop?: ReactElement<{ selectedRows: Row<T>[] }>;
  renderSelectComponent?: ReactElement<{ selectedRows: Row<T>[]; isAllSelected: boolean }>;
  renderSubComponent?: ReactElement<{ row: Row<T> }>;
  onSearch?: (keyword: string) => Promise<unknown>;
}

/* ======    global     ====== */
const logger = createLogger('components/Table');

const Table = <T,>({
  thead,
  onSearch,
  fixHead,
  data,
  placeholder,
  allRowSelectTick,
  textAlignCenter = true,
  cacheColumnVisibility,
  setCacheColumnVisibility,
  makePagination = false,
  renderSubComponent,
  renderSelectComponent,
  renderSelectComponentAtTop,
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
  const { defaultPageSize } = useSetting();

  const defaultColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(renderSelectComponent || renderSelectComponentAtTop
        ? [
            {
              id: 'select',
              header: ({ table }: { table: Table<T> }) => (
                <div className="text-left">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
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
        header:
          fixHead?.[key] ??
          key
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
                    themeSize="xl"
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
    [thead, renderSelectComponent, renderSubComponent, renderSelectComponentAtTop],
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
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
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

  const selectedRows = useMemo(
    () => table.getRowModel().rows.filter((row) => rowSelection[row.id]),
    [table, rowSelection],
  );
  /* ======   function    ====== */
  const getNumericMsg = (newValue: number, limit: number) =>
    t('페이지{{limit}}를 벗어나는 수{{newValue}}는 입력할 수 없습니다.', { newValue, limit });
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (onSearch) onSearch(keyword);
    else setGlobalFilter(keyword);
  };
  const handleChangePage = (index: number) => table.setPageIndex(index);
  /* ======   useEffect   ====== */
  useEffect(() => {
    logger('useEffect: columnVisibility', columnVisibility);

    setCacheColumnVisibility && setCacheColumnVisibility(columnVisibility);
  }, [columnVisibility]);
  useEffect(() => {
    logger(
      'useEffect: allRowSelectTick, table.getState().pagination.pageIndex',
      table.getRowModel().rows,
      table.getState().pagination.pageSize,
      allRowSelectTick,
    );
    if (allRowSelectTick) setRowSelection(table.getRowModel().rows.reduce((a, v) => ({ ...a, [v.id]: true }), {}));
  }, [allRowSelectTick, table.getState().pagination.pageSize, table.getState().pagination.pageIndex, globalFilter]);
  return (
    <div className="p-4 bg-white shadow rounded-lg space-y-3">
      {renderSelectComponentAtTop && cloneElement(renderSelectComponentAtTop, { selectedRows })}
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
          {onSearch && <Test />}

          <Input
            type="search"
            autoComplete="table-search"
            defaultValue={globalFilter}
            debounceTime={300}
            // debounceTime={onSearch ? 600 : 300}
            onChange={handleSearchChange}
            placeholder={placeholder ?? onSearch ? t('검색어를 입력하세요.') : t('필터링할 키워드를 입력하세요.')}
          />
        </div>
        {renderSelectComponent && (
          <div className="flex items-center">
            {cloneElement(renderSelectComponent, { selectedRows, isAllSelected: table.getIsAllPageRowsSelected() })}
          </div>
        )}
      </div>
      <div className="mb-4 overflow-y-hidden lg:overflow-visible">
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
              table.getFilteredRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <Fragment key={row.id}>
                      <tr>
                        {row.getVisibleCells().map((cell) => (
                          <Td textAlignCenter={textAlignCenter} key={cell.id} cell={cell} />
                        ))}
                      </tr>
                      {row.getIsExpanded() && renderSubComponent && (
                        <tr className="!border-t-0 !border-b-gray-400 !border-b-2">
                          <td className="bg-slate-100" colSpan={row.getVisibleCells().length}>
                            {cloneElement(renderSubComponent, { row })}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={99} className="text-center py-8">
                    <Empty>{onSearch ? t('검색 결과가 없습니다.') : t('필터링 결과가 없습니다.')}</Empty>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={99} className="text-center py-8">
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
        <Pagination
          index={table.getState().pagination.pageIndex}
          onChange={handleChangePage}
          onChangePer={(index) => table.setPageSize(index)}
          max={table.getPageCount()}
          per={defaultPageSize}
          sizeOptions={pageSizeOptions}
          maxMessage={getNumericMsg}
          minMessage={getNumericMsg}
        />
      )}
      <hr />
    </div>
  );
};

export default Table;
