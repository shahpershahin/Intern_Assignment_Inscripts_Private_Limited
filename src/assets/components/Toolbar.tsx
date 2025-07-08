// src/components/Toolbar.tsx
import React from 'react';
import Button from './Button'; // Reusing the Button component
import { ChevronRight, EyeOff, SortAsc, Filter, Grid, Upload, Download, Share2, Plus } from 'lucide-react'; // Icons

// Define props for the Toolbar component
interface ToolbarProps {
  onHideFields: () => void;
  onSort: () => void;
  onFilter: () => void;
  onCellView: () => void;
  onImport: () => void;
  onExport: () => void;
  onShare: () => void;
  onNewAction: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onHideFields,
  onSort,
  onFilter,
  onCellView,
  onImport,
  onExport,
  onShare,
  onNewAction,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-border px-6 py-2 flex items-center justify-between flex-wrap gap-2 h-[56px] min-h-[56px]">
      {/* Left side: Toolbar label and dropdown */}
      <div className="flex items-center text-text-dark font-medium text-sm mr-4 min-w-[110px]">
        <span className="tracking-tight">Tool bar</span>
        <ChevronRight size={16} className="ml-1 text-text-light" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-1 flex-wrap">
        <Button onClick={onHideFields} icon={<EyeOff size={16} />} variant="ghost" className="px-2 py-1 h-8 min-w-[90px]">
          Hide fields
        </Button>
        <Button onClick={onSort} icon={<SortAsc size={16} />} variant="ghost" className="px-2 py-1 h-8 min-w-[70px]">
          Sort
        </Button>
        <Button onClick={onFilter} icon={<Filter size={16} />} variant="ghost" className="px-2 py-1 h-8 min-w-[70px]">
          Filter
        </Button>
        <Button onClick={onCellView} icon={<Grid size={16} />} variant="ghost" className="px-2 py-1 h-8 min-w-[90px]">
          Cell view
        </Button>
        <Button onClick={onImport} icon={<Upload size={16} />} variant="secondary" className="px-2 py-1 h-8 min-w-[80px]">
          Import
        </Button>
        <Button onClick={onExport} icon={<Download size={16} />} variant="secondary" className="px-2 py-1 h-8 min-w-[80px]">
          Export
        </Button>
        <Button onClick={onShare} icon={<Share2 size={16} />} variant="secondary" className="px-2 py-1 h-8 min-w-[80px]">
          Share
        </Button>
        <Button onClick={onNewAction} icon={<Plus size={16} />} variant="primary" className="px-2 py-1 h-8 min-w-[110px]">
          New Action
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;

