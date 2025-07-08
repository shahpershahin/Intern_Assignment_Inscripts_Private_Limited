// src/types.ts

// Interface for a single job request item
export interface JobRequest {
  id: number;
  request: string;
  submitted: string;
  submitter: string;
  status: 'In-process' | 'Need to start' | 'Complete' | 'Blocked';
  assignedTo: string;
  url: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  estValue: number;
}

// Interface for the column definition, useful for react-table
export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (info: { getValue: () => any, row: { original: T } }) => React.ReactNode;
  minWidth?: number;
}

