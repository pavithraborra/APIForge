import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiFolder, HiOutlineCollection, HiLightningBolt } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();

  // Mock static actions for now
  const staticActions = [
    { id: 'home', name: 'Go to Dashboard', icon: HiLightningBolt, action: () => navigate('/dashboard') },
    { id: 'new-ws', name: 'Create Workspace', icon: HiFolder, action: () => { /* open create modal */ } },
  ];

  // In a real app, we would search across the backend, but for this component
  // we'll just filter the static list + current workspaces
  
  const filteredWorkspaces = workspaces?.filter(ws => 
    ws.name.toLowerCase().includes(query.toLowerCase())
  ).map(ws => ({
    id: ws._id,
    name: ws.name,
    icon: HiFolder,
    group: 'Workspaces',
    action: () => navigate(`/workspaces/${ws._id}`)
  })) || [];

  const results = query ? [
    ...staticActions.filter(a => a.name.toLowerCase().includes(query.toLowerCase())),
    ...filteredWorkspaces
  ] : [
    ...staticActions,
    ...filteredWorkspaces.slice(0, 3)
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // The toggle logic is usually handled higher up, but we prevent default here
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-borders overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-borders">
              <HiSearch className="h-6 w-6 text-text-muted mr-3" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-0 outline-none text-text-primary placeholder:text-text-muted text-lg"
                placeholder="Search anything... (Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1 text-xs text-text-muted font-medium ml-3">
                <kbd className="bg-secondary-bg px-2 py-1 rounded border border-borders">ESC</kbd> to close
              </div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id || index}
                        className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-hover hover:text-primary text-text-primary transition-colors text-left"
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                      >
                        <Icon className="h-5 w-5 mr-3 text-text-muted group-hover:text-primary" />
                        <span className="font-medium">{item.name}</span>
                        {item.group && (
                          <span className="ml-auto text-xs text-text-muted bg-secondary-bg px-2 py-1 rounded-full">
                            {item.group}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-14 text-center">
                  <HiSearch className="mx-auto h-8 w-8 text-text-muted mb-3 opacity-50" />
                  <p className="text-text-secondary font-medium">No results found for "{query}"</p>
                  <p className="text-sm text-text-muted mt-1">Try searching for workspaces, collections, or requests.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
