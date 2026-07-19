import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast, Card, Button, Input, Modal, Select, EmptyState, Spinner } from '../../components/ui';
import workspaceService from '../../services/workspaceService';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineUserGroup, HiOutlineArrowRight } from 'react-icons/hi';
import { colors } from '../../theme/theme';

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces, activeWorkspace, setActiveWorkspace, refreshWorkspaces } = useWorkspace();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#E78F81');
  const [avatar, setAvatar] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Preset theme colors matching Warm Peach system
  const colorPresets = ['#F4B183', '#F7D6BF', '#D8C3F2', '#B8E6D2', '#FFD89C', '#58C27D', '#E65A5A'];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await workspaceService.createWorkspace({ name, description, color, avatar });
      addToast({
        title: 'Workspace Created',
        message: `Successfully created "${name}"`,
        type: 'success'
      });
      setIsCreateModalOpen(false);
      resetForm();
      await refreshWorkspaces();
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to create workspace',
        type: 'error'
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedWorkspace || !name.trim()) return;

    try {
      await workspaceService.updateWorkspace(selectedWorkspace._id, { name, description, color, avatar });
      addToast({
        title: 'Workspace Updated',
        message: `Successfully updated "${name}"`,
        type: 'success'
      });
      setIsEditModalOpen(false);
      resetForm();
      await refreshWorkspaces();
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update workspace',
        type: 'error'
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await workspaceService.deleteWorkspace(id);
      addToast({
        title: 'Workspace Deleted',
        message: `Successfully deleted "${name}"`,
        type: 'success'
      });
      if (activeWorkspace?._id === id) {
        setActiveWorkspace(null);
      }
      await refreshWorkspaces();
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete workspace',
        type: 'error'
      });
    }
  };

  const openEditModal = (ws) => {
    setSelectedWorkspace(ws);
    setName(ws.name);
    setDescription(ws.description || '');
    setColor(ws.color || '#E78F81');
    setAvatar(ws.avatar || '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColor('#E78F81');
    setAvatar('');
    setSelectedWorkspace(null);
  };

  // Filter and Paginate workspaces
  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ws.description && ws.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkspaces = filteredWorkspaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWorkspaces.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-text-primary">Workspaces</h2>
          <p className="text-sm text-text-secondary">Organize and collaborate on your API collections</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
          className="flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          New Workspace
        </Button>
      </div>

      {/* Search and view options */}
      <Card className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white">
        <div className="relative w-full md:max-w-md">
          <Input
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            icon={HiOutlineSearch}
            className="w-full bg-primary-bg"
          />
        </div>
        <div className="text-xs text-text-secondary font-medium">
          Showing {currentWorkspaces.length} of {filteredWorkspaces.length} workspaces
        </div>
      </Card>

      {/* Grid listing */}
      {currentWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentWorkspaces.map((ws) => {
            const isActive = activeWorkspace?._id === ws._id;
            return (
              <Card 
                key={ws._id} 
                className={`relative flex flex-col justify-between overflow-hidden border-2 transition-all duration-300 ${
                  isActive ? 'border-primary shadow-md bg-white' : 'border-borders hover:border-primary/45 bg-white'
                }`}
                hoverable
              >
                {/* Header colored strip */}
                <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: ws.color || '#E78F81' }} />
                
                <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {ws.avatar ? (
                        <img src={ws.avatar} alt={ws.name} className="h-10 w-10 rounded-xl object-cover border border-borders" />
                      ) : (
                        <div 
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-poppins shadow-sm"
                          style={{ backgroundColor: ws.color || '#E78F81' }}
                        >
                          {ws.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-text-primary font-poppins text-lg">{ws.name}</h3>
                        <p className="text-xs text-text-secondary">Owner: {ws.owner?.username || 'You'}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary line-clamp-2 h-10">
                    {ws.description || 'No description provided for this workspace.'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <HiOutlineUserGroup className="h-4 w-4" />
                    <span>{ws.members?.length || 1} {ws.members?.length === 1 ? 'member' : 'members'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-borders flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(ws)}
                      className="p-1.5 rounded-md hover:bg-hover text-text-secondary hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(ws._id, ws.name)}
                      className="p-1.5 rounded-md hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors"
                      title="Delete"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {!isActive && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveWorkspace(ws)}
                        className="text-xs font-semibold hover:bg-hover"
                      >
                        Set Active
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/workspaces/${ws._id}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold"
                    >
                      Enter <HiOutlineArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Workspaces Found"
          description={searchQuery ? `No results matching "${searchQuery}"` : "Get started by creating your first workspace."}
          actionLabel="Create Workspace"
          onAction={() => { resetForm(); setIsCreateModalOpen(true); }}
        />
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-text-secondary px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Workspace"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme API Team"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short summary of what this workspace contains"
          />
          <Input
            label="Avatar URL (Optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Workspace Theme Color</label>
            <div className="flex gap-2">
              {colorPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${color === preset ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Workspace"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme API Team"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short summary of what this workspace contains"
          />
          <Input
            label="Avatar URL (Optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Workspace Theme Color</label>
            <div className="flex gap-2">
              {colorPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${color === preset ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Workspaces;
