import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast, Card, Button, Input, Select, Spinner, EmptyState } from '../components/ui';
import environmentService from '../services/environmentService';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSave, HiOutlineDocumentText } from 'react-icons/hi';

const Environments = () => {
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();

  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null);

  // Form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('development');

  const fetchEnvironments = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const res = await environmentService.getEnvironments(activeWorkspace._id);
      setEnvironments(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedEnv(res.data[0]);
      } else {
        setSelectedEnv(null);
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'Error', message: 'Failed to load environments', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, [activeWorkspace]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await environmentService.createEnvironment({
        name,
        type,
        workspace: activeWorkspace._id,
        variables: []
      });
      addToast({ title: 'Success', message: 'Environment created successfully', type: 'success' });
      setIsCreateOpen(false);
      setName('');
      setType('development');
      fetchEnvironments();
    } catch (err) {
      addToast({ title: 'Error', message: err.response?.data?.message || 'Failed to create environment', type: 'error' });
    }
  };

  const handleSaveVariables = async () => {
    if (!selectedEnv) return;

    try {
      await environmentService.updateEnvironment(selectedEnv._id, selectedEnv);
      addToast({ title: 'Saved', message: 'Environment variables saved successfully', type: 'success' });
      fetchEnvironments();
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to save environment variables', type: 'error' });
    }
  };

  const handleDeleteEnv = async (id) => {
    if (!window.confirm('Are you sure you want to delete this environment?')) return;

    try {
      await environmentService.deleteEnvironment(id);
      addToast({ title: 'Deleted', message: 'Environment deleted successfully', type: 'success' });
      fetchEnvironments();
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to delete environment', type: 'error' });
    }
  };

  const addVariable = () => {
    if (!selectedEnv) return;
    const newVar = { key: '', value: '', isActive: true };
    setSelectedEnv({
      ...selectedEnv,
      variables: [...(selectedEnv.variables || []), newVar]
    });
  };

  const updateVariable = (index, field, val) => {
    if (!selectedEnv) return;
    const updatedVars = [...selectedEnv.variables];
    updatedVars[index] = { ...updatedVars[index], [field]: val };
    setSelectedEnv({
      ...selectedEnv,
      variables: updatedVars
    });
  };

  const deleteVariable = (index) => {
    if (!selectedEnv) return;
    setSelectedEnv({
      ...selectedEnv,
      variables: selectedEnv.variables.filter((_, idx) => idx !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-text-primary">Environments</h2>
          <p className="text-sm text-text-secondary">Manage environment variables for different stages</p>
        </div>
        {activeWorkspace && (
          <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
            <HiOutlinePlus className="h-5 w-5" /> New Environment
          </Button>
        )}
      </div>

      {!activeWorkspace ? (
        <EmptyState
          title="No Active Workspace"
          description="Please select an active workspace to manage environments."
        />
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : environments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar selector */}
          <Card className="bg-white p-4 flex flex-col gap-2 h-fit">
            <span className="text-xs font-semibold text-text-secondary uppercase pb-2 border-b border-borders">Stage environments</span>
            {environments.map((env) => {
              const isSelected = selectedEnv?._id === env._id;
              return (
                <div
                  key={env._id}
                  onClick={() => setSelectedEnv(env)}
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors ${
                    isSelected ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-hover text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: env.type === 'production' ? '#E65A5A' : env.type === 'testing' ? '#FFD89C' : '#58C27D' }} />
                    <span>{env.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEnv(env._id);
                    }}
                    className="p-1 rounded hover:bg-white text-text-muted hover:text-danger"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </Card>

          {/* Variables table */}
          {selectedEnv ? (
            <Card className="md:col-span-3 bg-white p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-borders pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary font-poppins">{selectedEnv.name}</h3>
                  <p className="text-xs text-text-secondary">Type: {selectedEnv.type.toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addVariable}>
                    Add Variable
                  </Button>
                  <Button onClick={handleSaveVariables} className="flex items-center gap-2">
                    <HiOutlineSave className="h-4 w-4" /> Save
                  </Button>
                </div>
              </div>

              {selectedEnv.variables && selectedEnv.variables.length > 0 ? (
                <div className="space-y-3">
                  {selectedEnv.variables.map((variable, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={variable.isActive}
                        onChange={(e) => updateVariable(idx, 'isActive', e.target.checked)}
                        className="h-4 w-4 rounded border-borders text-primary focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Variable Key (e.g. API_URL)"
                        value={variable.key}
                        onChange={(e) => updateVariable(idx, 'key', e.target.value)}
                        className="flex-1 bg-primary-bg border border-borders rounded-xl px-4 py-2 text-sm text-text-primary outline-none focus:border-primary font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Variable Value"
                        value={variable.value}
                        onChange={(e) => updateVariable(idx, 'value', e.target.value)}
                        className="flex-1 bg-primary-bg border border-borders rounded-xl px-4 py-2 text-sm text-text-primary outline-none focus:border-primary font-mono"
                      />
                      <button
                        onClick={() => deleteVariable(idx)}
                        className="p-2 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-text-muted text-sm font-semibold">
                  No environment variables declared. Add some keys to configure variables.
                </div>
              )}
            </Card>
          ) : (
            <div className="md:col-span-3 text-center py-12 text-text-muted">Select an environment</div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No Environments Configured"
          description="Create your first stage environment (e.g. Development, Production) to store variables."
          actionLabel="Create Environment"
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">New Stage Environment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Environment Name"
                placeholder="e.g. Local Dev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label="Environment Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: 'development', label: 'Development' },
                  { value: 'testing', label: 'Testing/Staging' },
                  { value: 'production', label: 'Production' }
                ]}
              />
              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Environments;
