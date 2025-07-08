// src/components/Footer.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // Icon for the add button

// Define props for the Footer component
interface FooterProps {
  onNewTab: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNewTab }) => {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState('All Orders');

  // Array of tab names
  const tabs = ['All Orders', 'Pending', 'Reviewed', 'Arrived'];

  // Handle tab click and log to console
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    console.log(`Tab clicked: ${tabName}`);
  };

  return (
    <footer className="bg-white border-t border-border px-6 py-2 flex items-center justify-between sticky bottom-0 z-20 h-[56px] min-h-[56px]">
      {/* Left section: Tabs */}
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 h-9 min-w-[110px] flex items-center justify-center
              ${activeTab === tab
                ? 'bg-primary text-white shadow-sm' // Active tab styles
                : 'text-text-dark hover:bg-gray-100 border border-transparent' // Inactive tab styles
              }`}
            onClick={() => handleTabClick(tab)}
            style={{ boxShadow: activeTab === tab ? '0 1px 2px 0 rgba(0,0,0,0.06)' : undefined }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right section: Add new tab button */}
      <button
        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shadow-sm hover:bg-indigo-700 transition-colors duration-200 border border-primary"
        onClick={onNewTab}
        aria-label="Add new tab"
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.10)' }}
      >
        <Plus size={20} />
      </button>
    </footer>
  );
};

export default Footer;

