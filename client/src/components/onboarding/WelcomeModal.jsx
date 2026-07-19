import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkspace } from '../../context/WorkspaceContext';
import workspaceService from '../../services/workspaceService';
import collectionService from '../../services/collectionService';
import Logo from '../../assets/Logo';
import { HiOutlineArrowRight, HiOutlineCube, HiOutlineFolder, HiCheck, HiSparkles } from 'react-icons/hi';

const WelcomeModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { refreshWorkspaces, setActiveWorkspace } = useWorkspace();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceColor, setWorkspaceColor] = useState('#E78F81');
  const [collectionName, setCollectionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdWorkspace, setCreatedWorkspace] = useState(null);

  const colors = ['#E78F81', '#F6B89E', '#FFD8BE', '#B8E6D2', '#D8C3F2', '#F2B880'];

  if (!isOpen) return null;

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    setLoading(true);
    try {
      const res = await workspaceService.createWorkspace({
        name: workspaceName,
        color: workspaceColor,
        description: 'First workspace created during onboarding.'
      });
      setCreatedWorkspace(res.data);
      await refreshWorkspaces();
      setActiveWorkspace(res.data);
      handleNextStep();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!collectionName.trim() || !createdWorkspace) return;
    setLoading(true);
    try {
      await collectionService.createCollection({
        name: collectionName,
        workspaceId: createdWorkspace._id,
        description: 'First API Collection'
      });
      handleNextStep();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (user) {
      localStorage.setItem(`onboarded_user_${user._id}`, 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-borders flex flex-col transition-all transform duration-300">
        
        {/* Progress header bar */}
        <div className="h-1.5 bg-secondary-bg flex">
          {[1, 2, 3, 4].map(idx => (
            <div 
              key={idx} 
              className={`flex-1 transition-all duration-500 ${idx <= step ? 'bg-primary' : 'bg-transparent'}`} 
            />
          ))}
        </div>

        <div className="p-8 flex-1 flex flex-col justify-center">
          {step === 1 && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary animate-bounce">
                  <Logo size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold font-poppins text-text-primary">Welcome to APIForge!</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                  Let's get your collaborative API development workspace configured in just a few quick steps.
                </p>
              </div>

              <div className="bg-primary-bg rounded-2xl p-4 border border-borders text-left flex items-start gap-3">
                <HiSparkles className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text-primary">What you can do here:</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Design end-to-end endpoints, isolate multiple project variables, and collaborate in real-time with team presence notifications.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
              >
                <span>Get Started</span>
                <HiOutlineArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleCreateWorkspace} className="space-y-6 animate-slide-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary">
                  <HiOutlineCube className="h-4 w-4" />
                  Step 2 of 4
                </div>
                <h2 className="text-2xl font-bold font-poppins text-text-primary">Name Your Workspace</h2>
                <p className="text-text-secondary text-xs">
                  Workspaces group collections, environments, activity feeds, and teammates together.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">Workspace Title</label>
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. My New Project, Acme Corp Services"
                  className="w-full px-4 py-3 rounded-xl border border-borders bg-primary-bg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">Theme Color Accent</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setWorkspaceColor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center`}
                      style={{ 
                        backgroundColor: c, 
                        borderColor: workspaceColor === c ? '#2F2A28' : 'transparent' 
                      }}
                    >
                      {workspaceColor === c && <HiCheck className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Continue'}
                <HiOutlineArrowRight className="h-5 w-5" />
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleCreateCollection} className="space-y-6 animate-slide-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary">
                  <HiOutlineFolder className="h-4 w-4" />
                  Step 3 of 4
                </div>
                <h2 className="text-2xl font-bold font-poppins text-text-primary">Create Your First Collection</h2>
                <p className="text-text-secondary text-xs">
                  Collections house individual request runners and endpoints.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">Collection Name</label>
                <input
                  type="text"
                  required
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g. Users API, Payments Sync"
                  className="w-full px-4 py-3 rounded-xl border border-borders bg-primary-bg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Continue'}
                <HiOutlineArrowRight className="h-5 w-5" />
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success border-2 border-success/30">
                  <HiCheck className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-poppins text-text-primary">You are all set!</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                  Your customized workspace is ready for endpoint building and collaborative testing.
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
              >
                <span>Go to Dashboard</span>
                <HiOutlineArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
