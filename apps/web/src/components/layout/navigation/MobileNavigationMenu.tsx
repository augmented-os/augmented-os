
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type MobileNavigationMenuProps = {
  items: { label: string; path: string }[];
};

const MobileNavigationMenu = ({ items }: MobileNavigationMenuProps) => {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden mt-2 overflow-x-auto flex space-x-4 pb-1">
      {items.map((item) => (
        <Link 
          key={item.label}
          to={item.path}
          className={`whitespace-nowrap px-3 py-1 text-sm font-medium rounded-md ${
            isActiveLink(item.path)
              ? 'bg-gray-100 text-primary'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default MobileNavigationMenu;
