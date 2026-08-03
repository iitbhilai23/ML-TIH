import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Inbox, Layers } from 'lucide-react';
import Spinner from './Spinner';
import styles from '../../modules/trainers/Trainers.module.css';

/**
 * Modern Reusable TanStack Table v8 Component
 * Soft Purple & Glass Aesthetic with Row Hover Glow & Dynamic Pill Pagination
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

  // Pre-process columns to automatically disable global filter & sorting for display/action columns
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
    <div
      className={`${styles.tableCard || ''} ${className}`}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(192, 132, 252, 0.3)',
        boxShadow: '0 15px 35px -10px rgba(124, 58, 237, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        ...tableCardStyle
      }}
    >
      <div className={styles.tableWrapper || ''} style={{ overflowY: 'auto', flex: 1 }}>
        <table className={styles.table || ''} style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.875rem' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{
                  background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 50%, #faf5ff 100%)',
                }}
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const headerMeta = header.column.columnDef.meta || {};

                  return (
                    <th
                      key={header.id}
                      style={{
                        padding: '16px 20px',
                        textAlign: headerMeta.align || 'left',
                        width: header.column.columnDef.size !== 150 ? header.column.columnDef.size : undefined,
                        cursor: isSortable ? 'pointer' : 'default',
                        userSelect: 'none',
                        color: '#4c1d95',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        borderBottom: '2px solid #ddd6fe',
                        background: 'inherit',
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
                          <span style={{ display: 'inline-flex', opacity: isSorted ? 1 : 0.45 }}>
                            {isSorted === 'asc' ? (
                              <ArrowUp size={14} color="#7c3aed" />
                            ) : isSorted === 'desc' ? (
                              <ArrowDown size={14} color="#7c3aed" />
                            ) : (
                              <ArrowUpDown size={13} color="#9333ea" />
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
                <td colSpan={safeColumns.length} style={{ textAlign: 'center', padding: '60px' }}>
                  <Spinner overlay={false} />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={safeColumns.length} style={{ textAlign: 'center', padding: '65px', color: '#94a3b8' }}>
                  {emptyIcon || <Inbox size={52} style={{ margin: '0 auto 14px', color: '#c084fc', opacity: 0.4, display: 'block' }} />}
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4c1d95' }}>{emptyText}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>Try adjusting search query or filters</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rIdx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: rIdx % 2 === 0 ? '#ffffff' : '#faf9fe',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderLeft: '4px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3e8ff';
                    e.currentTarget.style.borderLeft = '4px solid #7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = rIdx % 2 === 0 ? '#ffffff' : '#faf9fe';
                    e.currentTarget.style.borderLeft = '4px solid transparent';
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellMeta = cell.column.columnDef.meta || {};
                    return (
                      <td
                        key={cell.id}
                        style={{
                          padding: '15px 20px',
                          textAlign: cellMeta.align || 'left',
                          maxWidth: cell.column.columnDef.maxWidth || undefined,
                          fontSize: cellMeta.fontSize || undefined,
                          color: cellMeta.color || '#1e293b',
                          fontWeight: 500,
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

      {/* Modern Soft Purple Pagination Footer */}
      {!loading && currentTotal > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid #ede9fe',
            background: '#fcfbfe',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          {/* Entries Info */}
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Showing</span>
            <span style={{ fontWeight: 800, color: '#581c87', background: '#f3e8ff', padding: '2px 8px', borderRadius: '6px' }}>{startRow} - {endRow}</span>
            <span>of</span>
            <span style={{ fontWeight: 800, color: '#581c87', background: '#f3e8ff', padding: '2px 8px', borderRadius: '6px' }}>{currentTotal}</span>
            <span>records</span>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 15px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: !table.getCanPreviousPage() ? '#f8fafc' : '#ffffff',
                color: !table.getCanPreviousPage() ? '#cbd5e1' : '#475569',
                cursor: !table.getCanPreviousPage() ? 'not-allowed' : 'pointer',
                fontSize: '0.83rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                boxShadow: !table.getCanPreviousPage() ? 'none' : '0 2px 6px rgba(0,0,0,0.03)',
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
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {/* Page Index Badge */}
            <div style={{ display: 'flex', gap: '6px', margin: '0 6px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '7px 16px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                }}
              >
                Page {pageIndex + 1}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                of {pageCount || 1}
              </span>
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 15px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: !table.getCanNextPage() ? '#f8fafc' : '#ffffff',
                color: !table.getCanNextPage() ? '#cbd5e1' : '#475569',
                cursor: !table.getCanNextPage() ? 'not-allowed' : 'pointer',
                fontSize: '0.83rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                boxShadow: !table.getCanNextPage() ? 'none' : '0 2px 6px rgba(0,0,0,0.03)',
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
                  e.currentTarget.style.color = '#475569';
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
