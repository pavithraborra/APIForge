import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import workspaceService from '../services/workspaceService';
import { useAuth } from '../hooks/useAuth';

export const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);

  const fetchWorkspaces = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const res = await workspaceService.getWorkspaces();
      const data = res.data || [];
      setWorkspaces(data);
      
      // Select the first workspace on first load only
      if (data.length > 0 && !hasInitializedRef.current) {
        hasInitializedRef.current = true;
        const savedId = localStorage.getItem('activeWorkspaceId');
        const saved = savedId ? data.find(w => w._id === savedId) : null;
        setActiveWorkspaceState(saved || data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
      setError(err.response?.data?.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
      hasInitializedRef.current = false;
    }
  }, [isAuthenticated, fetchWorkspaces]);

  const selectWorkspace = (workspace) => {
    setActiveWorkspaceState(workspace);
    if (workspace) {
      localStorage.setItem('activeWorkspaceId', workspace._id);
    } else {
      localStorage.removeItem('activeWorkspaceId');
    }
  };

  const refreshWorkspaces = async () => {
    await fetchWorkspaces();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace: selectWorkspace,
        loading,
        error,
        refreshWorkspaces
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

