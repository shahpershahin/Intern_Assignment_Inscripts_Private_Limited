// src/components/Header.tsx
import React from 'react';
import { Search, ChevronDown, User } from 'lucide-react'; // Icons from lucide-react

// Define props for the Header component
interface HeaderProps {
  onSearchClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onProfileClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-border px-6 py-3 flex items-center justify-between h-[64px]">
      {/* Left section: Workspace title */}
      <div className="flex items-center min-w-[340px]">
        <h1 className="text-lg font-semibold text-text-dark mr-1 tracking-tight leading-none">Workspace <span className="font-normal text-text-light">/ Folder 2 /</span> Spreadsheet 3</h1>
        <ChevronDown size={18} className="text-text-light cursor-pointer ml-1" onClick={() => console.log('Workspace dropdown clicked')} />
      </div>

      {/* Center section: Search bar */}
      <div className="flex-grow max-w-[340px] mx-8 relative">
        <input
          type="text"
          placeholder="Search within sheet"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-border focus:ring-primary focus:border-primary text-sm text-text-dark bg-[#F9FAFB] placeholder:text-text-light"
          onFocus={() => console.log('Search input focused')}
          style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light cursor-pointer" onClick={onSearchClick} />
      </div>

      {/* Right section: User profile */}
      <div className="flex items-center space-x-3 min-w-[220px] justify-end">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-text-dark leading-tight">Shahper Shahin</span>
          <span className="text-xs text-text-light leading-tight">abc@gmail.com</span>
        </div>
        <div
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-200 border border-border"
          onClick={onProfileClick}
        >
          <User size={20} className="text-text-light" />
        </div>
      </div>
    </header>
  );
};

export default Header;

