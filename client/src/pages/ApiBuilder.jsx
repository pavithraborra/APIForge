import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast, Card, Button, Input, Select, Tabs, Spinner, Badge, Modal } from '../components/ui';
import collectionService from '../services/collectionService';
import requestService from '../services/requestService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineFolder, HiOutlinePlus, HiOutlineSave, HiOutlinePlay, 
  HiOutlineTrash, HiOutlineDocumentDuplicate, HiOutlineDocumentText, HiChevronDown, HiChevronRight,
  HiOutlineLightningBolt
} from 'react-icons/hi';

const ApiBuilder = () => {
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();

  const [collections, setCollections] = useState([]);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  // Editor Tabs & Panels
  const [editorTab, setEditorTab] = useState('params');
  const [responseTab, setResponseTab] = useState('body');

  // Response Execution States
  const [executing, setExecuting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState(null);

  // Sidebar toggles
  const [expandedCollections, setExpandedCollections] = useState({});

  // Ad-hoc/New request modal state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestCollectionId, setNewRequestCollectionId] = useState('');

  // Ad-hoc/New collection modal state
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const fetchCollectionsAndRequests = async () => {
    if (!activeWorkspace) return;
    setLoadingSidebar(true);
    try {
      const res = await collectionService.getCollections(activeWorkspace._id);
      // collectionService returns response.data from axios,
      // which is the server's JSON: { success, count, data: [...] }
      // So we need res.data (the array) or res (if already unwrapped)
      const collectionsArray = Array.isArray(res) ? res
        : Array.isArray(res?.data) ? res.data
        : [];
      setCollections(collectionsArray);
    } catch (err) {
      console.error(err);
      addToast({ title: 'Error', message: 'Failed to load collections', type: 'error' });
    } finally {
      setLoadingSidebar(false);
    }
  };

  useEffect(() => {
    fetchCollectionsAndRequests();
  }, [activeWorkspace]);

  const loadRequest = async (id) => {
    setLoadingRequest(true);
    setExecutionResponse(null);
    try {
      const res = await requestService.getRequest(id);
      setRequestData(res.data);
      setSelectedRequestId(id);
      if (res.data && res.data.response) {
        setExecutionResponse(res.data.response);
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'Error', message: 'Failed to load request details', type: 'error' });
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      await collectionService.createCollection({
        name: newCollectionName,
        workspaceId: activeWorkspace._id
      });
      addToast({ title: 'Collection Created', message: 'Successfully added new collection', type: 'success' });
      setIsNewCollectionOpen(false);
      setNewCollectionName('');
      fetchCollectionsAndRequests();
    } catch (err) {
      addToast({ title: 'Error', message: err.response?.data?.message || 'Failed to create collection', type: 'error' });
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequestName.trim() || !newRequestCollectionId) return;

    try {
      const res = await requestService.createRequest({
        name: newRequestName,
        collectionId: newRequestCollectionId,
        workspaceId: activeWorkspace._id,
        method: 'GET',
        url: 'https://api.github.com'
      });
      addToast({ title: 'Request Created', message: 'Successfully added new API request', type: 'success' });
      setIsNewRequestOpen(false);
      setNewRequestName('');
      fetchCollectionsAndRequests();
      loadRequest(res.data._id);
    } catch (err) {
      addToast({ title: 'Error', message: err.response?.data?.message || 'Failed to create request', type: 'error' });
    }
  };

  const handleSaveRequest = async () => {
    if (!selectedRequestId || !requestData) return;

    try {
      await requestService.updateRequest(selectedRequestId, requestData);
      addToast({ title: 'Request Saved', message: 'Successfully saved request configuration', type: 'success' });
      fetchCollectionsAndRequests();
    } catch (err) {
      addToast({ title: 'Error', message: err.response?.data?.message || 'Failed to save request', type: 'error' });
    }
  };

  const handleExecuteRequest = async () => {
    if (!selectedRequestId || !requestData) return;

    setExecuting(true);
    setExecutionResponse(null);
    try {
      // Auto save before executing to match what's in backend database
      await requestService.updateRequest(selectedRequestId, requestData);
      
      const res = await requestService.executeRequest(selectedRequestId);
      const executionResult = res.data;
      setExecutionResponse(executionResult);
      
      // Update local requestData with newly saved response
      setRequestData(prev => ({
        ...prev,
        response: executionResult
      }));
      
      addToast({ title: 'Execution Complete', message: `Status: ${executionResult.statusCode}`, type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ title: 'Execution Failed', message: err.response?.data?.message || 'Failed to run endpoint request', type: 'error' });
    } finally {
      setExecuting(false);
    }
  };

  const handleDeleteRequest = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this request?')) return;

    try {
      await requestService.deleteRequest(id);
      addToast({ title: 'Request Deleted', message: 'Deleted successfully', type: 'success' });
      if (selectedRequestId === id) {
        setSelectedRequestId(null);
        setRequestData(null);
      }
      fetchCollectionsAndRequests();
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to delete request', type: 'error' });
    }
  };

  const handleDuplicateRequest = async (id, e) => {
    e.stopPropagation();
    try {
      await requestService.duplicateRequest(id);
      addToast({ title: 'Request Duplicated', message: 'Created copy successfully', type: 'success' });
      fetchCollectionsAndRequests();
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to duplicate request', type: 'error' });
    }
  };

  const toggleCollectionExpand = (id) => {
    setExpandedCollections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Grid/List row operations
  const addRow = (type) => {
    const newRow = { key: '', value: '', isActive: true };
    setRequestData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), newRow]
    }));
  };

  const updateRow = (type, index, field, value) => {
    setRequestData(prev => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [type]: updated };
    });
  };

  const deleteRow = (type, index) => {
    setRequestData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="flex h-[82vh] gap-6 overflow-hidden">
      {/* LEFT SIDEBAR: Collections & Requests */}
      <Card className="w-80 flex flex-col h-full bg-white border border-borders p-4 select-none overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-borders mb-4">
          <h3 className="font-bold text-text-primary font-poppins text-md">Collections</h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsNewCollectionOpen(true)}
            className="p-1.5 hover:bg-hover"
          >
            <HiOutlinePlus className="h-4 w-4" />
          </Button>
        </div>

        {loadingSidebar ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : collections.length > 0 ? (
          <div className="space-y-2 flex-1">
            {collections.map(col => (
              <div key={col._id} className="space-y-1">
                <div 
                  onClick={() => toggleCollectionExpand(col._id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-hover cursor-pointer text-text-primary font-medium text-sm transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCollections[col._id] ? <HiChevronDown /> : <HiChevronRight />}
                    <HiOutlineFolder className="h-4 w-4 text-primary" />
                    <span className="truncate max-w-[120px]">{col.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewRequestCollectionId(col._id);
                      setIsNewRequestOpen(true);
                    }}
                    className="p-1 rounded hover:bg-white text-text-muted hover:text-primary"
                    title="Add Request"
                  >
                    <HiOutlinePlus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <AnimatePresence>
                  {expandedCollections[col._id] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-6 space-y-1 overflow-hidden"
                    >
                      {col.requests && col.requests.length > 0 ? (
                        col.requests.map(req => {
                          const isSelected = selectedRequestId === req._id;
                          return (
                            <div
                              key={req._id}
                              onClick={() => loadRequest(req._id)}
                              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer text-xs font-semibold group transition-all duration-200 ${
                                isSelected ? 'bg-primary/25 text-primary border border-primary/25' : 'hover:bg-hover text-text-secondary border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                  req.method === 'GET' ? 'text-success' : 'text-primary'
                                }`}>
                                  {req.method}
                                </span>
                                <span className="truncate max-w-[100px]">{req.name}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                <button 
                                  onClick={(e) => handleDuplicateRequest(req._id, e)}
                                  className="p-0.5 rounded hover:bg-white text-text-muted hover:text-primary"
                                >
                                  <HiOutlineDocumentDuplicate className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteRequest(req._id, e)}
                                  className="p-0.5 rounded hover:bg-white text-text-muted hover:text-danger"
                                >
                                  <HiOutlineTrash className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-[10px] text-text-muted pl-2 py-1">No requests saved yet.</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-xs text-text-muted p-4">
            No collections found. Create a collection first.
          </div>
        )}
      </Card>

      {/* RIGHT EDITOR PANEL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {loadingRequest ? (
          <div className="flex-1 flex items-center justify-center bg-white border border-borders rounded-2xl">
            <Spinner size="lg" />
          </div>
        ) : requestData ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white border border-borders rounded-2xl p-6 space-y-4">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-borders">
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText className="h-5 w-5 text-primary" />
                <input 
                  type="text"
                  value={requestData.name}
                  onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                  className="font-semibold text-lg font-poppins text-text-primary bg-transparent outline-none border-b border-transparent hover:border-borders focus:border-primary transition-all duration-200"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleSaveRequest}>
                  <HiOutlineSave className="h-4 w-4" /> Save
                </Button>
                <Button className="flex items-center gap-2" onClick={handleExecuteRequest} loading={executing}>
                  <HiOutlinePlay className="h-4 w-4" /> Send
                </Button>
              </div>
            </div>

            {/* Input URL panel */}
            <div className="flex gap-2">
              <select
                value={requestData.method}
                onChange={(e) => setRequestData({ ...requestData, method: e.target.value })}
                className="bg-primary-bg border border-borders rounded-xl px-4 py-2 text-sm font-semibold text-text-primary outline-none focus:border-primary"
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="text"
                value={requestData.url}
                onChange={(e) => setRequestData({ ...requestData, url: e.target.value })}
                placeholder="https://api.example.com/v1/resource"
                className="flex-1 bg-primary-bg border border-borders rounded-xl px-4 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>

            {/* Tabs for Request configs */}
            <Tabs 
              tabs={[
                { id: 'params', label: 'Params' },
                { id: 'headers', label: 'Headers' },
                { id: 'body', label: 'Body' },
                { id: 'auth', label: 'Authorization' },
              ]}
              activeTab={editorTab}
              onChange={setEditorTab}
            />

            {/* Config Panels */}
            <div className="flex-1 overflow-y-auto min-h-[150px] border border-borders rounded-xl p-4">
              {/* PARAMS / HEADERS */}
              {(editorTab === 'params' || editorTab === 'headers') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-text-secondary uppercase">
                      {editorTab === 'params' ? 'Query Parameters' : 'Headers'}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => addRow(editorTab === 'params' ? 'queryParams' : 'headers')}>
                      Add Row
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {((editorTab === 'params' ? requestData.queryParams : requestData.headers) || []).map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={row.isActive}
                          onChange={(e) => updateRow(editorTab === 'params' ? 'queryParams' : 'headers', idx, 'isActive', e.target.checked)}
                          className="h-4 w-4 rounded border-borders text-primary focus:ring-primary"
                        />
                        <input
                          type="text"
                          placeholder="Key"
                          value={row.key}
                          onChange={(e) => updateRow(editorTab === 'params' ? 'queryParams' : 'headers', idx, 'key', e.target.value)}
                          className="flex-1 bg-primary-bg border border-borders rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) => updateRow(editorTab === 'params' ? 'queryParams' : 'headers', idx, 'value', e.target.value)}
                          className="flex-1 bg-primary-bg border border-borders rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary font-mono"
                        />
                        <button
                          onClick={() => deleteRow(editorTab === 'params' ? 'queryParams' : 'headers', idx)}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BODY (JSON Code input) */}
              {editorTab === 'body' && (
                <div className="h-full flex flex-col space-y-2">
                  <div className="flex gap-4 text-xs font-semibold text-text-secondary pb-2 border-b border-borders">
                    <label className="flex items-center gap-1.5">
                      <input 
                        type="radio" 
                        checked={requestData.body?.type === 'json'}
                        onChange={() => setRequestData({ ...requestData, body: { ...requestData.body, type: 'json' } })}
                      /> JSON
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input 
                        type="radio" 
                        checked={requestData.body?.type === 'none'}
                        onChange={() => setRequestData({ ...requestData, body: { ...requestData.body, type: 'none' } })}
                      /> None
                    </label>
                  </div>
                  {requestData.body?.type === 'json' && (
                    <textarea
                      placeholder='{ "key": "value" }'
                      value={requestData.body?.content || ''}
                      onChange={(e) => setRequestData({ ...requestData, body: { ...requestData.body, content: e.target.value } })}
                      className="w-full flex-1 min-h-[120px] bg-primary-bg border border-borders rounded-lg p-3 font-mono text-xs text-text-primary outline-none focus:border-primary"
                    />
                  )}
                </div>
              )}

              {/* AUTHORIZATION */}
              {editorTab === 'auth' && (
                <div className="space-y-4">
                  <Select
                    label="Authorization Type"
                    value={requestData.auth?.type || 'none'}
                    onChange={(e) => setRequestData({ ...requestData, auth: { ...requestData.auth, type: e.target.value } })}
                    options={[
                      { value: 'none', label: 'No Auth' },
                      { value: 'bearer', label: 'Bearer Token' },
                      { value: 'basic', label: 'Basic Auth' }
                    ]}
                  />

                  {requestData.auth?.type === 'bearer' && (
                    <Input
                      label="Token"
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                      value={requestData.auth?.token || ''}
                      onChange={(e) => setRequestData({ ...requestData, auth: { ...requestData.auth, token: e.target.value } })}
                    />
                  )}

                  {requestData.auth?.type === 'basic' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Username"
                        placeholder="admin"
                        value={requestData.auth?.username || ''}
                        onChange={(e) => setRequestData({ ...requestData, auth: { ...requestData.auth, username: e.target.value } })}
                      />
                      <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={requestData.auth?.password || ''}
                        onChange={(e) => setRequestData({ ...requestData, auth: { ...requestData.auth, password: e.target.value } })}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTTOM RESPONSE PANEL */}
            <div className="border border-borders rounded-xl flex flex-col h-[280px] overflow-hidden bg-primary-bg/25">
              {executing ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                  <Spinner size="md" />
                  <span className="text-xs text-text-muted font-medium">Sending endpoint request...</span>
                </div>
              ) : executionResponse ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-4 py-2 border-b border-borders bg-white">
                    <div className="flex items-center gap-4">
                      <Badge variant={executionResponse.statusCode >= 200 && executionResponse.statusCode < 300 ? 'success' : 'danger'}>
                        {executionResponse.statusCode} {executionResponse.statusText}
                      </Badge>
                      <span className="text-xs text-text-secondary">Time: <strong className="text-text-primary">{executionResponse.responseTime} ms</strong></span>
                      <span className="text-xs text-text-secondary">Size: <strong className="text-text-primary">
                        {typeof executionResponse.responseSize === 'number'
                          ? (executionResponse.responseSize < 1024
                              ? `${executionResponse.responseSize} B`
                              : `${(executionResponse.responseSize / 1024).toFixed(2)} KB`)
                          : (executionResponse.responseSize || '0 B')}
                      </strong></span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="xs" 
                        variant={responseTab === 'body' ? 'primary' : 'ghost'} 
                        onClick={() => setResponseTab('body')}
                      >
                        Body
                      </Button>
                      <Button 
                        size="xs" 
                        variant={responseTab === 'headers' ? 'primary' : 'ghost'} 
                        onClick={() => setResponseTab('headers')}
                      >
                        Headers
                      </Button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                    {responseTab === 'body' ? (
                      <pre className="text-text-primary whitespace-pre-wrap">
                        {typeof executionResponse.responseBody === 'object' 
                          ? JSON.stringify(executionResponse.responseBody, null, 2) 
                          : typeof executionResponse.responseBody === 'string'
                            ? executionResponse.responseBody
                            : 'No response body returned.'
                        }
                      </pre>
                    ) : (
                      <div className="space-y-1">
                        {Array.isArray(executionResponse.responseHeaders) ? (
                          executionResponse.responseHeaders.map((header) => (
                            <div key={header.key || header._id} className="flex gap-2 border-b border-borders/30 pb-1">
                              <span className="text-text-secondary w-40 font-semibold">{header.key}:</span>
                              <span className="text-text-primary flex-1">{header.value}</span>
                            </div>
                          ))
                        ) : (
                          Object.entries(executionResponse.responseHeaders || {}).map(([key, val]) => (
                            <div key={key} className="flex gap-2 border-b border-borders/30 pb-1">
                              <span className="text-text-secondary w-40 font-semibold">{key}:</span>
                              <span className="text-text-primary flex-1">{val}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-text-muted p-4">
                  Send a request to see the response content here.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-borders rounded-2xl text-center p-8">
            <HiOutlineLightningBolt className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-text-primary font-poppins">Select an API Endpoint</h3>
            <p className="text-sm text-text-secondary max-w-sm mt-1">
              Choose a request from the sidebar collections or create a new one to begin executing requests.
            </p>
          </div>
        )}
      </div>

      {/* CREATE COLLECTION MODAL */}
      <Modal
        isOpen={isNewCollectionOpen}
        onClose={() => setIsNewCollectionOpen(false)}
        title="New Collection"
      >
        <form onSubmit={handleCreateCollection} className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="e.g. Users API"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            required
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsNewCollectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE REQUEST MODAL */}
      <Modal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        title="New Request"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <Input
            label="Request Name"
            placeholder="e.g. Get Profile"
            value={newRequestName}
            onChange={(e) => setNewRequestName(e.target.value)}
            required
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsNewRequestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApiBuilder;
