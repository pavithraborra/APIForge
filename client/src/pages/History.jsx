import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast, Card, Button, Input, Select, Spinner, EmptyState, Badge } from '../components/ui';
import historyService from '../services/historyService';
import { HiOutlineTrash, HiOutlineSearch, HiOutlineClock } from 'react-icons/hi';

const History = () => {
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  
  // Detail sidebar state
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const res = await historyService.getHistory(activeWorkspace._id, {
        method: method || undefined,
        url: search || undefined
      });
      setHistoryItems(res.data || []);
    } catch (err) {
      console.error(err);
      addToast({ title: 'Error', message: 'Failed to fetch history', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeWorkspace, method]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear ALL execution logs for this workspace? This cannot be undone.')) return;

    try {
      await historyService.clearHistory(activeWorkspace._id);
      addToast({ title: 'Cleared', message: 'Execution logs cleared successfully', type: 'success' });
      setHistoryItems([]);
      setSelectedItem(null);
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to clear execution logs', type: 'error' });
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await historyService.deleteHistory(id);
      addToast({ title: 'Deleted', message: 'Log entry deleted successfully', type: 'success' });
      setHistoryItems(prev => prev.filter(item => item._id !== id));
      if (selectedItem?._id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to delete log entry', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-text-primary">Request History</h2>
          <p className="text-sm text-text-secondary">Track execution times, status responses and payloads</p>
        </div>
        {activeWorkspace && historyItems.length > 0 && (
          <Button onClick={handleClear} className="bg-danger hover:bg-danger/90 text-white flex items-center gap-2 border-none">
            <HiOutlineTrash className="h-5 w-5" /> Clear History
          </Button>
        )}
      </div>

      {!activeWorkspace ? (
        <EmptyState
          title="No Active Workspace"
          description="Select an active workspace to view its API run history logs."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card className="bg-white p-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search request logs by URL..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={HiOutlineSearch}
                    className="w-full bg-primary-bg"
                  />
                </div>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  options={[
                    { value: '', label: 'All Methods' },
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' }
                  ]}
                  className="sm:w-40"
                />
                <Button type="submit">Filter</Button>
              </form>
            </Card>

            {/* List */}
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : historyItems.length > 0 ? (
              <div className="space-y-3">
                {historyItems.map((item) => (
                  <Card
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-white border-2 cursor-pointer flex justify-between items-center transition-all duration-200 ${
                      selectedItem?._id === item._id ? 'border-primary shadow-sm' : 'border-borders hover:border-primary/45'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Badge method={item.method}>{item.method}</Badge>
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-semibold text-text-primary truncate block max-w-md">{item.url}</span>
                        <span className="text-[10px] text-text-muted">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-text-secondary font-medium">{item.responseTime} ms</span>
                      <Badge variant={item.statusCode >= 200 && item.statusCode < 300 ? 'success' : 'danger'}>
                        {item.statusCode}
                      </Badge>
                      <button
                        onClick={(e) => handleDeleteItem(item._id, e)}
                        className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Logs Available"
                description={search || method ? "No history matching current filter criteria." : "Run your first API request inside Builder to write logs here."}
              />
            )}
          </div>

          {/* Details Sidebar panel */}
          <div>
            {selectedItem ? (
              <Card className="bg-white p-6 space-y-6 h-fit max-h-[80vh] overflow-y-auto sticky top-24">
                <div className="border-b border-borders pb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge method={selectedItem.method}>{selectedItem.method}</Badge>
                    <Badge variant={selectedItem.statusCode >= 200 && selectedItem.statusCode < 300 ? 'success' : 'danger'}>
                      {selectedItem.statusCode} {selectedItem.statusText}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs font-semibold break-all text-text-primary block">{selectedItem.url}</span>
                  <span className="text-[10px] text-text-muted block mt-2">Executed At: {new Date(selectedItem.createdAt).toLocaleString()}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-text-secondary block uppercase mb-1">Metrics</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-primary-bg p-2 rounded-lg border border-borders">
                        <span className="text-text-muted block">Duration</span>
                        <strong className="text-text-primary">{selectedItem.responseTime} ms</strong>
                      </div>
                      <div className="bg-primary-bg p-2 rounded-lg border border-borders">
                        <span className="text-text-muted block">Payload Size</span>
                        <strong className="text-text-primary">{selectedItem.responseSize || '0 B'}</strong>
                      </div>
                    </div>
                  </div>

                  {selectedItem.responseBody && (
                    <div>
                      <span className="text-xs font-bold text-text-secondary block uppercase mb-1">Response Body</span>
                      <pre className="bg-primary-bg border border-borders rounded-lg p-3 font-mono text-[10px] text-text-primary overflow-x-auto max-h-40">
                        {typeof selectedItem.responseBody === 'object' 
                          ? JSON.stringify(selectedItem.responseBody, null, 2) 
                          : selectedItem.responseBody
                        }
                      </pre>
                    </div>
                  )}

                  {selectedItem.responseHeaders && (
                    <div>
                      <span className="text-xs font-bold text-text-secondary block uppercase mb-1">Response Headers</span>
                      <div className="bg-primary-bg border border-borders rounded-lg p-3 font-mono text-[10px] text-text-primary max-h-40 overflow-y-auto space-y-1">
                        {Object.entries(selectedItem.responseHeaders).map(([key, val]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-text-muted">{key}:</span>
                            <span className="text-text-primary">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="bg-white p-8 text-center text-text-muted text-sm font-semibold flex flex-col justify-center items-center h-48 border-dashed border-2">
                <HiOutlineClock className="h-10 w-10 text-text-muted mb-2 opacity-50" />
                Select a log item to view complete response parameters
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
