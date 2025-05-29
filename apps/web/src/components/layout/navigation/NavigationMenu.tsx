import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

type NavigationMenuProps = {
  items: { label: string; path: string }[];
};

const NavigationMenu = ({ items }: NavigationMenuProps) => {
  return (
    <ShadcnNavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {items.map((item, index) => (
          <NavigationMenuItem key={item.label}>
            <NavLink 
              to={item.path}
              end={index === 0}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium ${ 
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  );
};

export default NavigationMenu;
