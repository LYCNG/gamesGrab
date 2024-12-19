import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard,
  MdPeople,
  MdInventory,
  MdArticle,
  MdLogin 
} from 'react-icons/md';
import type { IconType } from 'react-icons';

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: MdDashboard, label: 'Dashboard', path: '/admin' },
  { icon: MdPeople, label: 'User', path: '/admin/user' },
  { icon: MdInventory, label: 'Product', path: '/admin/product' },
  { icon: MdArticle, label: 'Blog', path: '/admin/blog' },
  { icon: MdLogin, label: 'Sign in', path: '/admin/signin' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
         
          <span className="font-semibold">Admin View</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};