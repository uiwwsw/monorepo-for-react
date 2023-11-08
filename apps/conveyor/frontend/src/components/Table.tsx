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
} from '@tanstack/react-table';
import React from 'react';

/* ======   interface   ====== */
interface ReusableTableProps<T> {
  thead: string[];
  data: T[];
  useSelect?: boolean;
  usePagination?: boolean;
  useColumnSelect?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('Component/Table2');

export function ReusableTable<T>({
  thead,
  data,
  useSelect = false,
  usePagination = false,
  useColumnSelect = false,
}: ReusableTableProps<T>) {
  const defaultColumns = React.useMemo<ColumnDef<T>[]>(
    () => [
      // Conditionally include 'select' column based on useSelect value
      ...(useSelect
        ? [
            {
              id: 'select',
              header: ({ table }) => (
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />
              ),
              cell: ({ row }) => (
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
        footer: (props) => props.column.id,
      })),
    ],
    [thead, useSelect],
  );

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
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: usePagination ? getPaginationRowModel() : undefined,
    onColumnVisibilityChange: useColumnSelect ? setColumnVisibility : undefined,
    debugTable: true,
  });

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {useColumnSelect && (
        <div className="border border-gray-300 rounded-lg">
          <div className="px-2 py-1 border-b border-gray-300 bg-gray-100">
            <label className="flex items-center space-x-2">
              <input
                {...{
                  type: 'checkbox',
                  className: 'form-checkbox h-5 w-5 text-blue-600',
                  checked: table.getIsAllColumnsVisible(),
                  onChange: table.getToggleAllColumnsVisibilityHandler(),
                }}
              />
              <span className="text-gray-700 font-medium">Toggle All</span>
            </label>
          </div>
          <div className="px-2 py-1 flex flex-wrap">
            {table.getAllLeafColumns().map((column) => {
              return (
                <label key={column.id} className="flex items-center space-x-2 mr-4">
                  <input
                    {...{
                      type: 'checkbox',
                      className: 'form-checkbox h-5 w-5 text-blue-600',
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />
                  <span className="text-gray-700 font-medium">{column.id}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
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
                            className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span>
                            {header.column.getIsSorted() === 'asc' && ' 🔼'}
                            {header.column.getIsSorted() === 'desc' && ' 🔽'}
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
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            {useSelect && (
              <tr>
                <td
                  colSpan={thead.length + (useSelect ? 1 : 0)}
                  className="px-6 py-3 text-sm font-medium text-gray-500"
                >
                  {Object.keys(rowSelection).length} of {table.getPreFilteredRowModel().rows.length} Total Rows Selected
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
      {usePagination && (
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
      <hr />
    </div>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
}

export default ReusableTable;
