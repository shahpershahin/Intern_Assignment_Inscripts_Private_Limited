// src/App.tsx
import Header from '../src/assets/components/Header';
import Toolbar from '../src/assets/components/Toolbar';
import Spreadsheet from '../src/assets/components/Spreadsheet';
import Footer from '../src/assets/components/Footer';
import { jobRequests } from './data'; // Import mock data

function App() {
  // Log functions for button/tab interactions (Acceptance Criteria 3)
  const handleSearchClick = () => console.log('Search icon clicked!');
  const handleProfileClick = () => console.log('Profile icon clicked!');
  const handleHideFields = () => console.log('Hide fields clicked!');
  const handleSort = () => console.log('Sort clicked!');
  const handleFilter = () => console.log('Filter clicked!');
  const handleCellView = () => console.log('Cell view clicked!');
  const handleImport = () => console.log('Import clicked!');
  const handleExport = () => console.log('Export clicked!');
  const handleShare = () => console.log('Share clicked!');
  const handleNewAction = () => console.log('New Action clicked!');
  const handleNewTab = () => console.log('New Tab (+) clicked!');

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      {/* Header component */}
      <Header
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
      />

      {/* Toolbar component */}
      <Toolbar
        onHideFields={handleHideFields}
        onSort={handleSort}
        onFilter={handleFilter}
        onCellView={handleCellView}
        onImport={handleImport}
        onExport={handleExport}
        onShare={handleShare}
        onNewAction={handleNewAction}
      />

      {/* Main content area: Spreadsheet */}
      <Spreadsheet data={jobRequests} />

      {/* Footer component */}
      <Footer onNewTab={handleNewTab} />
    </div>
  );
}

export default App;

