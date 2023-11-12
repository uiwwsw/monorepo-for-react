import { createLogger } from '@package-frontend/utils';
import { HTMLProps } from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  getExpandedRowModel,
  FilterFn,
  getFilteredRowModel,
  Table,
  Row,
  Column,
} from '@tanstack/react-table';
import React from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Button, Checkbox, Input, Select } from '@library-frontend/ui';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import DebouncedInput from './DebouncedInput';

/* ======   interface   ====== */
export interface ReusableTableProps<T> {
  thead: string[];
  data: T[];
  makePagination?: boolean;
  makeColumnSelect?: boolean;
  renderSelectComponent?: () => React.ReactElement | null;
  renderSubComponent?: () => React.ReactElement | null;
}

/* ======    global     ====== */
const logger = createLogger('Component/ReusableTable');

export function ReusableTable<T>({
  thead,
  data,
  makePagination = false,
  makeColumnSelect = false,
  renderSubComponent,
  renderSelectComponent,
}: ReusableTableProps<T>) {
  const defaultColumns = React.useMemo<ColumnDef<T>[]>(
    () => [
      ...(renderSelectComponent
        ? [
            {
              id: 'select',
              header: ({ table }: { table: Table<T> }) => (
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />
              ),
              cell: ({ row }: { row: Row<T> }) => (
                <div className="px-1">
                  <IndeterminateCheckbox
                    {...{
                      checked: row.getIsSelected(),
                      disabled: !row.getCanSelect(),
                      indeterminate: row.getIsSomeSelected(),
                      onChange: row.getToggleSelectedHandler(),
                    }}
                  />
                </div>
              ),
            },
          ]
        : []),

      ...thead.map((key) => ({
        accessorKey: key,
        header: key.replace(/^\w/, (c) => c.toUpperCase()),
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
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      style: { cursor: 'pointer' },
                    }}
                  >
                    {row.getIsExpanded() ? '👇' : '👉'}
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

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: makePagination ? getPaginationRowModel() : undefined,
    onColumnVisibilityChange: makeColumnSelect ? setColumnVisibility : undefined,
    debugTable: true,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
  });

  const pageSizeOptions = [
    { value: '10', label: '10개씩 보기' },
    { value: '20', label: '20개씩 보기' },
    { value: '30', label: '30개씩 보기' },
    { value: '40', label: '40개씩 보기' },
    { value: '50', label: '50개씩 보기' },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg space-y-3">
      {makeColumnSelect && (
        <div className="border border-gray-300 rounded-lg">
          <div className="px-2 py-1 border-b border-gray-300 bg-gray-100">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
              />

              <span className="text-gray-700 font-medium">전체 선택</span>
            </label>
          </div>
          <div className="px-2 py-1 flex flex-wrap">
            {table.getAllLeafColumns().map((column) => {
              return (
                <label key={column.id} className="flex items-center space-x-2 mr-4">
                  <Checkbox checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />
                  <span className="text-gray-700 font-medium">{column.id}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <Input
          value={globalFilter ?? ''}
          onChange={({ currentTarget }) => setGlobalFilter(currentTarget.value)}
          placeholder="검색어를 입력하세요"
        />
        {Object.values(rowSelection).some(Boolean) && renderSelectComponent && (
          <div className="flex items-center">{renderSelectComponent()}</div>
        )}
      </div>
      <div className="mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? 'flex cursor-pointer select-none gap-1' : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
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
            {table.getRowModel().rows.map((row) => {
              return (
                <React.Fragment key={row.id}>
                  <tr>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr key={row.id + 'expanded'}>
                      <td colSpan={row.getVisibleCells().length}>{renderSubComponent ? renderSubComponent() : null}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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
        <div className="flex items-center gap-2">
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
          <span className="flex items-center gap-1">
            <div>페이지</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | 페이지 이동:
            <Input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border rounded w-24"
              placeholder="page"
            />
          </span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            options={pageSizeOptions}
          />
        </div>
      )}
      <hr />
    </div>
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export default ReusableTable;
