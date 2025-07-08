// src/components/Spreadsheet.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
} from '@tanstack/react-table';
import { JobRequest, ColumnDef } from '../../types';

interface SpreadsheetProps {
  data: JobRequest[];
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data }) => {
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<JobRequest>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        cell: info => (
          <div className="font-bold text-text-dark">
            {info.getValue<number>()}
          </div>
        ),
        minWidth: 50,
      },
      {
        accessorKey: 'request',
        header: 'Job Request',
        minWidth: 250,
      },
      {
        accessorKey: 'submitted',
        header: 'Submitted',
        minWidth: 150,
      },
      {
        accessorKey: 'submitter',
        header: 'Submitter',
        minWidth: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue<string>();
          let statusClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
          switch (status) {
            case 'In-process':
              statusClasses += ' bg-blue-100 text-blue-800';
              break;
            case 'Need to start':
              statusClasses += ' bg-yellow-100 text-yellow-800';
              break;
            case 'Complete':
              statusClasses += ' bg-green-100 text-green-800';
              break;
            case 'Blocked':
              statusClasses += ' bg-red-100 text-red-800';
              break;
            default:
              statusClasses += ' bg-gray-100 text-gray-800';
              break;
          }
          return <span className={statusClasses}>{status}</span>;
        },
        minWidth: 150,
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        minWidth: 150,
      },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: info => (
          <a
            href={`https://${info.getValue<string>()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {info.getValue<string>()}
          </a>
        ),
        minWidth: 200,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: info => {
          const priority = info.getValue<string>();
          let priorityClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
          switch (priority) {
            case 'High':
              priorityClasses += ' bg-red-100 text-red-800';
              break;
            case 'Medium':
              priorityClasses += ' bg-orange-100 text-orange-800';
              break;
            case 'Low':
              priorityClasses += ' bg-gray-100 text-gray-800';
              break;
            default:
              break;
          }
          return <span className={priorityClasses}>{priority}</span>;
        },
        minWidth: 100,
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        minWidth: 120,
      },
      {
        accessorKey: 'estValue',
        header: 'Est. Value',
        cell: info => (
          <span className="font-mono text-text-dark">
            ${info.getValue<number>().toLocaleString('en-US')}
          </span>
        ),
        minWidth: 150,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCellClick = useCallback((rowIndex: number, colIndex: number, cellValue: any) => {
    setActiveCell({ row: rowIndex, col: colIndex });
    setSelectedCells(new Set());
    console.log(`Cell clicked: Row ${rowIndex}, Col ${colIndex}, Value: ${cellValue}`);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!activeCell) return;

    const { row, col } = activeCell;
    let newRow = row;
    let newCol = col;

    switch (event.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        event.preventDefault();
        break;
      case 'ArrowDown':
        newRow = Math.min(table.getRowModel().rows.length - 1, row + 1);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        event.preventDefault();
        break;
      case 'ArrowRight':
        newCol = Math.min(table.getAllColumns().length - 1, col + 1);
        event.preventDefault();
        break;
      case 'Enter':
        console.log(`Enter key pressed on cell: Row ${row}, Col ${col}`);
        event.preventDefault();
        break;
      case 'Tab':
        newCol = col + 1;
        if (newCol >= table.getAllColumns().length) {
          newCol = 0;
          newRow = Math.min(table.getRowModel().rows.length - 1, row + 1);
        }
        event.preventDefault();
        break;
      default:
        return;
    }

    setActiveCell({ row: newRow, col: newCol });

    const cellElement = tableContainerRef.current?.querySelector(
      `[data-row-index="${newRow}"][data-col-index="${newCol}"]`
    ) as HTMLElement;
    cellElement?.focus();
    cellElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeCell, table]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown as EventListener);
      container.focus();
    }
    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown as EventListener);
      }
    };
  }, [handleKeyDown]);

  const handleMouseDown = (event: React.MouseEvent, rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
    setSelectedCells(new Set([`${rowIndex}-${colIndex}`]));
    const startCell = { row: rowIndex, col: colIndex };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const targetCell = (moveEvent.target as HTMLElement).closest('.spreadsheet-cell');
      if (targetCell) {
        const endRow = parseInt(targetCell.getAttribute('data-row-index') || '0', 10);
        const endCol = parseInt(targetCell.getAttribute('data-col-index') || '0', 10);
        const newSelection = new Set<string>();
        const minRow = Math.min(startCell.row, endRow);
        const maxRow = Math.max(startCell.row, endRow);
        const minCol = Math.min(startCell.col, endCol);
        const maxCol = Math.max(startCell.col, endCol);

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            newSelection.add(`${r}-${c}`);
          }
        }
        setSelectedCells(newSelection);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={tableContainerRef}
      className="flex-grow overflow-auto bg-white rounded-lg shadow-custom-md border border-border m-4"
      tabIndex={0}
      style={{ minHeight: '520px', maxHeight: 'calc(100vh - 220px)' }}
    >
      <div className="inline-block min-w-full">
        <div className="grid" style={{ gridTemplateColumns: `56px repeat(${columns.length - 1}, minmax(140px, 1fr))` }}>
          <div className="spreadsheet-header-cell sticky top-0 bg-gray-50 z-10 h-[44px] border-l border-border" />
          {table.getHeaderGroups().map(headerGroup => (
            <React.Fragment key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <div
                  key={header.id}
                  className="spreadsheet-header-cell sticky top-0 bg-gray-50 z-10 h-[44px] border-l border-border"
                  style={{ minWidth: header.column.columnDef.minWidth ?? 140, fontSize: '13px', fontWeight: 600 }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </React.Fragment>
          ))}

          {table.getRowModel().rows.map((row: Row<JobRequest>, rowIndex: number) => (
            <React.Fragment key={row.id}>
              {row.getVisibleCells().map((cell, colIndex) => {
                const isSelected = selectedCells.has(`${rowIndex}-${colIndex}`);
                const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
                return (
                  <div
                    key={cell.id}
                    className={`spreadsheet-cell border-l border-border px-2 py-1 ${isSelected ? 'bg-blue-50' : ''} ${isActive ? 'ring-2 ring-primary' : ''}`}
                    data-row-index={rowIndex}
                    data-col-index={colIndex}
                    tabIndex={-1}
                    onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
