// src/components/Spreadsheet.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
} from '@tanstack/react-table';
import { JobRequest, ColumnDef } from '../../types'; // Import the JobRequest and ColumnDef interfaces

// Define props for the Spreadsheet component
interface SpreadsheetProps {
  data: JobRequest[]; // Array of job request data
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data }) => {
  // State to manage the currently active cell (for keyboard navigation and selection)
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  // State to manage selected cells (for range selection)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  // Ref for the table container to enable keyboard events
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Define columns for the table using useMemo for performance
  const columns = useMemo<ColumnDef<JobRequest>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        // Custom cell rendering for the ID column to make it look like a row number
        cell: info => (
          <div className="font-bold text-text-dark">
            {info.getValue<number>()}
          </div>
        ),
        minWidth: 50, // Smaller width for ID column
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
          // Dynamic styling for status based on its value
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
          <a href={`https://${info.getValue<string>()}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {info.getValue<string>()}
          </a>
        ),
        minWidth: 200,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: info => {
          // Dynamic styling for priority
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
          // Format estimated value as currency
          <span className="font-mono text-text-dark">
            ${info.getValue<number>().toLocaleString('en-US')}
          </span>
        ),
        minWidth: 150,
      },
    ],
    []
  );

  // Initialize react-table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle cell click to set active cell and log to console
  const handleCellClick = useCallback((rowIndex: number, colIndex: number, cellValue: any) => {
    setActiveCell({ row: rowIndex, col: colIndex });
    setSelectedCells(new Set()); // Clear any previous selections on single cell click
    console.log(`Cell clicked: Row ${rowIndex}, Col ${colIndex}, Value: ${cellValue}`);
  }, []);

  // Handle keyboard navigation (Stretch Goal)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!activeCell) return;

    const { row, col } = activeCell;
    let newRow = row;
    let newCol = col;

    switch (event.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        event.preventDefault(); // Prevent page scrolling
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
        // Simulate editing or opening cell content
        console.log(`Enter key pressed on cell: Row ${row}, Col ${col}`);
        event.preventDefault();
        break;
      case 'Tab':
        // Move to the next cell, wrapping to the next row if at end of column
        newCol = col + 1;
        if (newCol >= table.getAllColumns().length) {
          newCol = 0;
          newRow = Math.min(table.getRowModel().rows.length - 1, row + 1);
        }
        event.preventDefault();
        break;
      case 'Shift+Tab':
        // Move to the previous cell, wrapping to the previous row if at start of column
        newCol = col - 1;
        if (newCol < 0) {
          newCol = table.getAllColumns().length - 1;
          newRow = Math.max(0, row - 1);
        }
        event.preventDefault();
        break;
      default:
        return; // Do not prevent default for other keys
    }

    setActiveCell({ row: newRow, col: newCol });

    // Scroll the active cell into view
    const cellElement = tableContainerRef.current?.querySelector(
      `[data-row-index="${newRow}"][data-col-index="${newCol}"]`
    ) as HTMLElement;
    cellElement?.focus(); // Focus the cell for better accessibility
    cellElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  }, [activeCell, table]);

  // Add and remove keyboard event listener
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown as EventListener);
      // Focus the container initially so keyboard navigation works without clicking
      container.focus();
    }
    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown as EventListener);
      }
    };
  }, [handleKeyDown]);

  // Handle mouse down for selection start
  const handleMouseDown = (event: React.MouseEvent, rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
    setSelectedCells(new Set([`${rowIndex}-${colIndex}`]));

    const startCell = { row: rowIndex, col: colIndex };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Find the element under the mouse
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
      tabIndex={0} // Make the div focusable for keyboard events
      style={{ minHeight: '520px', maxHeight: 'calc(100vh - 220px)' }}
    >
      <div className="inline-block min-w-full">
        <div className="grid" style={{ gridTemplateColumns: `56px repeat(${columns.length - 1}, minmax(140px, 1fr))` }}>
          {/* Header Row */}
          <div className="spreadsheet-header-cell sticky top-0 bg-gray-50 z-10 h-[44px] border-l border-border" style={{ minWidth: 56, fontSize: '13px', fontWeight: 600, background: '#F9FAFB' }}></div>
          {table.getHeaderGroups().map(headerGroup => (
            <React.Fragment key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <div
                  key={header.id}
                  className="spreadsheet-header-cell sticky top-0 bg-gray-50 z-10 h-[44px] border-l border-border"
                  style={{ minWidth: header.column.columnDef.minWidth ?? 140, fontSize: '13px', fontWeight: 600, background: '#F9FAFB' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Data Rows */}
          {table.getRowModel().rows.map((row: Row<JobRequest>, rowIndex: number) => (
            <React.Fragment key={row.id}>
              {/* Row number cell */}
              <div
                className={`spreadsheet-cell bg-gray-50 font-bold text-text-dark sticky left-0 z-10 h-[40px] border-l border-border ${
                  activeCell?.row === rowIndex && activeCell.col === -1 ? 'active-cell' : ''
                }`}
                data-row-index={rowIndex}
                data-col-index={-1}
                onClick={() => handleCellClick(rowIndex, -1, row.original.id)}
                style={{ minWidth: 56, fontSize: '13px', background: '#F9FAFB' }}
              >
                {rowIndex + 1}
              </div>
              {row.getVisibleCells().map((cell, colIndex) => (
                <div
                  key={cell.id}
                  className={`spreadsheet-cell h-[40px] border-l border-border ${
                    activeCell?.row === rowIndex && activeCell.col === colIndex ? 'active-cell' : ''
                  } ${selectedCells.has(`${rowIndex}-${colIndex}`) ? 'selected-cell' : ''}`}
                  data-row-index={rowIndex}
                  data-col-index={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex, cell.getValue())}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  style={{ minWidth: cell.column.columnDef.minWidth ?? 140, fontSize: '13px', background: '#fff' }}
                  tabIndex={-1}
                  onMouseEnter={e => e.currentTarget.classList.add('hover:bg-gray-50')}
                  onMouseLeave={e => e.currentTarget.classList.remove('hover:bg-gray-50')}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Empty rows to fill space and match spreadsheet look */}
          {Array.from({ length: Math.max(0, 20 - data.length) }).map((_, rowIndexOffset) => {
            const currentRowIndex = data.length + rowIndexOffset;
            return (
              <React.Fragment key={`empty-row-${currentRowIndex}`}>
                <div
                  className={`spreadsheet-cell bg-gray-50 font-bold text-text-dark sticky left-0 z-10 h-[40px] border-l border-border ${
                    activeCell?.row === currentRowIndex && activeCell.col === -1 ? 'active-cell' : ''
                  }`}
                  data-row-index={currentRowIndex}
                  data-col-index={-1}
                  onClick={() => handleCellClick(currentRowIndex, -1, null)}
                  style={{ minWidth: 56, fontSize: '13px', background: '#F9FAFB' }}
                >
                  {currentRowIndex + 1}
                </div>
                {columns.map((_, colIndex) => (
                  <div
                    key={`empty-cell-${currentRowIndex}-${colIndex}`}
                    className={`spreadsheet-cell h-[40px] border-l border-border ${
                      activeCell?.row === currentRowIndex && activeCell.col === colIndex ? 'active-cell' : ''
                    } ${selectedCells.has(`${currentRowIndex}-${colIndex}`) ? 'selected-cell' : ''}`}
                    data-row-index={currentRowIndex}
                    data-col-index={colIndex}
                    onClick={() => handleCellClick(currentRowIndex, colIndex, null)}
                    onMouseDown={(e) => handleMouseDown(e, currentRowIndex, colIndex)}
                    style={{ minWidth: 140, fontSize: '13px', background: '#fff' }}
                    tabIndex={-1}
                    onMouseEnter={e => e.currentTarget.classList.add('hover:bg-gray-50')}
                    onMouseLeave={e => e.currentTarget.classList.remove('hover:bg-gray-50')}
                  >
                    {/* Empty cell content */}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;

