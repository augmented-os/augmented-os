import React from 'react';
import { Link, useNavigate, matchRoutes } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import NavigationMenu from './navigation/NavigationMenu';
import MobileNavigationMenu from './navigation/MobileNavigationMenu';
import SearchInput from './search/SearchInput';
import MobileSearchInput from './search/MobileSearchInput';
import ModeToggle from './mode/ModeToggle';
import { routeObjects } from '@/routes.config';

type TopbarProps = {
  currentMode: 'build' | 'work';
  setCurrentMode: (mode: 'build' | 'work') => void;
  breadcrumbs: string[];
};

const Topbar = ({ currentMode, setCurrentMode, breadcrumbs }: TopbarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMode = () => {
    const newMode = currentMode === 'build' ? 'work' : 'build';
    const currentPath = window.location.pathname;

    // When switching to work mode, go directly to tasks
    if (newMode === 'work') {
      setCurrentMode(newMode);
      navigate('/work/tasks');
      return;
    }

    // For build mode, keep the existing logic
    // Extract the path suffix (e.g., /workflows or "")
    const pathSuffix = currentPath.replace(/^\/(build|work)/, '');

    // Construct the potential target path in the new mode
    let targetPath = `/${newMode}${pathSuffix}`;

    // Check if the constructed path is a valid route
    const matches = matchRoutes(routeObjects, { pathname: targetPath });

    let isValidRoute = false;
    if (matches) {
      // A route is valid if it exists and isn't the catch-all (*)
      const lastMatch = matches[matches.length - 1];
      if (lastMatch.route.path !== '*') {
        isValidRoute = true;
      }
    }

    // Fall back to the base path if the target route is invalid
    if (!isValidRoute) {
      targetPath = `/${newMode}`;
    }

    setCurrentMode(newMode);
    navigate(targetPath);
  };

  // Function to get the dynamic workflow path
  const getWorkflowsPath = () => {
    const lastActiveId = sessionStorage.getItem('lastActiveWorkflowId');
    if (lastActiveId) {
      return `/build/workflows/${lastActiveId}`;
    }
    return '/build/workflows'; // Default path if no ID in session storage
  };

  const buildMenuItems = [
    { label: "Home", path: "/build" },
    { label: "Workflows", path: getWorkflowsPath() }, // Use dynamic path
    { label: "Integrations", path: "/build/integrations" },
    { label: "Data", path: "/build/data" },
    { label: "Docs", path: "/build/docs" },
  ];

  const workMenuItems = [
    { label: "Home", path: "/work" },
    { label: "Tasks", path: "/work/tasks" },
    { label: "Workflows", path: "/work/workflows" }, // Assuming work mode also has a workflows link, adjust if needed
    { label: "Data", path: "/work/data" },
    { label: "Docs", path: "/work/docs" },
  ];

  const currentMenuItems = currentMode === 'build' ? buildMenuItems : workMenuItems;

  return (
    <header className="w-full border-b border-gray-200 bg-white app-shadow">
      <div className="flex flex-col px-4 py-2 lg:py-3">
        <div className="flex items-center justify-between">
            <NavigationMenu items={currentMenuItems} />

          <div className="flex items-center">
            <div className="relative mr-4">
              <SearchInput />
            </div>

            {/* Mode toggle dropdown positioned at top right */}
            <ModeToggle currentMode={currentMode} toggleMode={toggleMode} />
          </div>
        </div>

        {/* Mobile view: Horizontal scrolling menu */}
        <MobileNavigationMenu items={currentMenuItems} />

        {/* Mobile search bar */}
        {isMobile && <MobileSearchInput />}
      </div>
    </header>
  );
};

export default Topbar;
