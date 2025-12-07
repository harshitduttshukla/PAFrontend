import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* Sidebar Component - state controlled */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-52 flex flex-col min-h-screen w-full transition-all duration-300">

        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex items-center sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-lg text-gray-800">Property Admin</span>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;