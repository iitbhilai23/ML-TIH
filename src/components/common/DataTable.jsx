import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import Spinner from './Spinner';
import styles from '../../modules/trainers/Trainers.module.css';

/**
 * Reusable TanStack Table v8 Component
 * 
 * @param {Array} data - Array of row items
 * @param {Array} columns - TanStack column definitions
 * @param {Boolean} loading - Loading indicator state
 * @param {String} globalFilter - Global search filter text
 * @param {Function} setGlobalFilter - Handler to update filter text
 * @param {Number} pageSize - Default items per page (default 50)
 * @param {String} emptyText - Text to display when table has no data
 * @param {ReactNode} emptyIcon - Custom icon for empty state
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  globalFilter = '',
  setGlobalFilter,
  pageSize = 50,
  emptyText = 'No data found',
  emptyIcon,
  className = '',
  tableCardStyle = {},
}) => {
  const [sorting, setSorting] = useState([]);

  // Ensure data is always an array
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Pre-process columns to automatically disable global filter & sorting for display/action columns without an accessorKey
  const safeColumns = useMemo(() => {
    return columns.map((col) => {
      const isDisplayColumn = !col.accessorKey && !col.accessorFn;
      return {
        ...col,
        enableGlobalFilter: col.enableGlobalFilter ?? !isDisplayColumn,
        enableSorting: col.enableSorting ?? !isDisplayColumn,
      };
    });
  }, [columns]);

  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
    state: {
      sorting,
      globalFilter: globalFilter || '',
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const filteredRows = table.getFilteredRowModel().rows;
  const currentTotal = filteredRows ? filteredRows.length : 0;
  const startRow = currentTotal > 0 ? pageIndex * table.getState().pagination.pageSize + 1 : 0;
  const endRow = Math.min((pageIndex + 1) * table.getState().pagination.pageSize, currentTotal);

  return (
    <div className={`${styles.tableCard || ''} ${className}`} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(124, 58, 237, 0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, ...tableCardStyle }}>
      <div className={styles.tableWrapper || ''} style={{ overflowY: 'auto', flex: 1 }}>
        <table className={styles.table || ''} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ background: 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #7e22ce 100%)' }}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const headerMeta = header.column.columnDef.meta || {};

                  return (
                    <th
                      key={header.id}
                      style={{
                        padding: '14px 18px',
                        textAlign: headerMeta.align || 'left',
                        width: header.column.columnDef.size !== 150 ? header.column.columnDef.size : undefined,
                        cursor: isSortable ? 'pointer' : 'default',
                        userSelect: 'none',
                        color: '#ffffff',
                        fontSize: '0.73rem',
                        fontWeight: 800,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        borderBottom: '2px solid rgba(255,255,255,0.12)',
                      }}
                      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          justifyContent: headerMeta.align === 'center' ? 'center' : 'flex-start',
                          width: '100%',
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          <span style={{ display: 'inline-flex', opacity: isSorted ? 1 : 0.4 }}>
                            {isSorted === 'asc' ? (
                              <ArrowUp size={13} color="#818cf8" />
                            ) : isSorted === 'desc' ? (
                              <ArrowDown size={13} color="#818cf8" />
                            ) : (
                              <ArrowUpDown size={12} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={safeColumns.length} style={{ textAlign: 'center', padding: '50px' }}>
                  <Spinner overlay={false} />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={safeColumns.length} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  {emptyIcon || <Inbox size={48} style={{ margin: '0 auto 12px', opacity: 0.2, display: 'block' }} />}
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>{emptyText}</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rIdx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: rIdx % 2 === 0 ? '#ffffff' : '#fafbfd',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f3ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = rIdx % 2 === 0 ? '#ffffff' : '#fafbfd'; }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellMeta = cell.column.columnDef.meta || {};
                    return (
                      <td
                        key={cell.id}
                        style={{
                          padding: '13px 18px',
                          textAlign: cellMeta.align || 'left',
                          maxWidth: cell.column.columnDef.maxWidth || undefined,
                          fontSize: cellMeta.fontSize || undefined,
                          color: cellMeta.color || '#334155',
                          verticalAlign: 'middle',
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && currentTotal > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid #f1f5f9',
            background: '#fafbfc',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
            Showing <span style={{ fontWeight: 700, color: '#0f172a' }}>{startRow}</span> to{' '}
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{endRow}</span> of{' '}
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentTotal}</span> entries
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 13px',
                borderRadius: '9px',
                border: '1.5px solid #e2e8f0',
                background: !table.getCanPreviousPage() ? '#f1f5f9' : '#ffffff',
                color: !table.getCanPreviousPage() ? '#cbd5e1' : '#334155',
                cursor: !table.getCanPreviousPage() ? 'not-allowed' : 'pointer',
                fontSize: '0.83rem',
                fontWeight: 600,
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (table.getCanPreviousPage()) {
                  e.currentTarget.style.borderColor = '#c084fc';
                  e.currentTarget.style.color = '#7c3aed';
                  e.currentTarget.style.background = '#f5f3ff';
                }
              }}
              onMouseLeave={(e) => {
                if (table.getCanPreviousPage()) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '4px', margin: '0 6px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                  color: '#fff',
                  borderRadius: '9px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: '0 3px 10px rgba(124, 58, 237, 0.3)',
                }}
              >
                {pageIndex + 1}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>of {pageCount || 1}</span>
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 13px',
                borderRadius: '99px',
                border: '1.5px solid #e2e8f0',
                background: !table.getCanNextPage() ? '#f1f5f9' : '#ffffff',
                color: !table.getCanNextPage() ? '#cbd5e1' : '#334155',
                cursor: !table.getCanNextPage() ? 'not-allowed' : 'pointer',
                fontSize: '0.83rem',
                fontWeight: 600,
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (table.getCanNextPage()) {
                  e.currentTarget.style.borderColor = '#c084fc';
                  e.currentTarget.style.color = '#7c3aed';
                  e.currentTarget.style.background = '#f5f3ff';
                }
              }}
              onMouseLeave={(e) => {
                if (table.getCanNextPage()) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
