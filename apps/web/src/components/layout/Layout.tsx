import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

// Constants for sidebar width
const DEFAULT_SIDEBAR_WIDTH = 280; // Adjust as needed (e.g., 320)
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const LOCAL_STORAGE_KEY = 'sidebarWidth';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // --- State for Sidebar Width ---
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null); // Ref for sidebar element
  // --------------------------------
  
  const [currentMode, setCurrentMode] = useState<'build' | 'work'>('build');
  const isMobile = useIsMobile();

  const breadcrumbs = ['Home', 'Workflows', 'Definitions'];

  // --- useEffect for Initial Width from Local Storage ---
  useEffect(() => {
    const storedWidth = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedWidth) {
      const parsedWidth = parseInt(storedWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth >= MIN_SIDEBAR_WIDTH && parsedWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(parsedWidth);
      }
    }
  }, []); // Empty dependency array: run only on mount

  // --- useEffect for Persisting Width to Local Storage ---
  useEffect(() => {
    // Don't save default during initial hydration if nothing was stored
    if (sidebarWidth !== DEFAULT_SIDEBAR_WIDTH || localStorage.getItem(LOCAL_STORAGE_KEY)) {
       localStorage.setItem(LOCAL_STORAGE_KEY, String(sidebarWidth));
    }
  }, [sidebarWidth]);
  // --------------------------------------------------------

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      // Keep desktop sidebar open/closed based on its current state
      // setSidebarOpen(true); // Don't force open on desktop
    }
  }, [isMobile]);

  // Handle keyboard shortcut for sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Cmd+Left or Alt+Cmd+Right
      if (e.altKey && (e.metaKey || e.ctrlKey)) {
        if (e.key === 'ArrowLeft') {
          setSidebarOpen(false);
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          setSidebarOpen(true);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Resize Logic ---
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !sidebarRef.current) return;
    
    // Calculate new width based on mouse position relative to the viewport start
    // This is generally more stable than using movementX for calculating width
    let newWidth = e.clientX; 

    // Apply constraints
    newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(newWidth, MAX_SIDEBAR_WIDTH));
    
    setSidebarWidth(newWidth);
    
    // Optional: Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

  }, []);

  const handleResizeEnd = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false;
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      // Restore text selection and cursor
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }, [handleResizeMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
     // Prevent default drag behavior if any
     e.preventDefault();
     isResizing.current = true;
     window.addEventListener('mousemove', handleResizeMove);
     window.addEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove, handleResizeEnd]);
  // ------------------

  // Function to toggle sidebar open/close
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Topbar 
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar 
          ref={sidebarRef}
          isOpen={sidebarOpen} 
          onClose={toggleSidebar}
          width={sidebarWidth}
          onResizeStart={handleResizeStart}
        />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
