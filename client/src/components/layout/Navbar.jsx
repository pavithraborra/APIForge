import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt2, HiSearch, HiOutlineBell, HiOutlineChevronDown, HiPlus } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Avatar, Dropdown, CommandPalette } from '../ui';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);

  // Derive title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  const userMenuItems = [
    { label: 'Profile', onClick: () => navigate('/profile') },
    { label: 'Settings', onClick: () => navigate('/settings') },
    { divider: true },
    { label: 'Logout', onClick: logout, danger: true }
  ];

  const workspaceItems = workspaces.map(ws => ({
    label: ws.name,
    onClick: () => setActiveWorkspace(ws),
    icon: ws._id === activeWorkspace?._id ? () => <span className="w-2 h-2 rounded-full bg-success mr-2" /> : null
  }));

  workspaceItems.push({ divider: true });
  workspaceItems.push({ label: 'Create Workspace', icon: HiPlus, onClick: () => navigate('/workspaces') });

  return (
    <>
      <header className="h-16 bg-white border-b border-borders flex items-center justify-between px-4 sm:px-6 z-10">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="mr-4 lg:hidden p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-hover"
          >
            <HiMenuAlt2 className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-text-primary">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Global Search */}
          <button 
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center px-3 py-1.5 bg-secondary-bg hover:bg-hover border border-borders rounded-lg text-sm text-text-muted transition-colors w-64"
          >
            <HiSearch className="h-4 w-4 mr-2" />
            <span>Search...</span>
            <kbd className="ml-auto hidden font-sans text-xs sm:inline-block border border-borders rounded px-1 bg-white">Ctrl K</kbd>
          </button>
          
          <button 
            onClick={() => setCmdOpen(true)}
            className="sm:hidden p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-hover"
          >
            <HiSearch className="h-5 w-5" />
          </button>

          {/* Workspace Switcher */}
          {workspaces.length > 0 && (
            <div className="hidden md:block">
              <Dropdown
                trigger={
                  <button className="flex items-center px-3 py-1.5 border border-borders rounded-lg text-sm font-medium hover:bg-hover transition-colors max-w-[200px]">
                    <span className="truncate">{activeWorkspace?.name || 'Select Workspace'}</span>
                    <HiOutlineChevronDown className="ml-2 h-4 w-4 text-text-muted flex-shrink-0" />
                  </button>
                }
                items={workspaceItems}
              />
            </div>
          )}

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-hover transition-colors"
          >
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-danger border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="pl-2 border-l border-borders">
            <Dropdown
              trigger={
                <div className="flex items-center hover:opacity-80 transition-opacity">
                  <Avatar src={user?.profilePicture} name={user?.username} size="sm" />
                  <HiOutlineChevronDown className="ml-1 h-3 w-3 text-text-muted" />
                </div>
              }
              items={userMenuItems}
            />
          </div>
        </div>
      </header>
      
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Navbar;
