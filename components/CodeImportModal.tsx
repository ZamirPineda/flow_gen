
import React, { useState } from 'react';
import { X, Code2, Loader2, ArrowRight, FileCode, CheckCircle2, Github, Globe, Search, AlertCircle } from 'lucide-react';
import { scanRepository } from '../services/githubService';

interface CodeImportModalProps {
  onClose: () => void;
  onImport: (code: string) => Promise<void>;
}

const CodeImportModal: React.FC<CodeImportModalProps> = ({ onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'github'>('paste');
  
  // Paste State
  const [code, setCode] = useState('');
  
  // GitHub State
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [scanStatus, setScanStatus] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVisualize = async () => {
      setErrorMsg(null);
      setIsAnalyzing(true);
      
      try {
          let contentToAnalyze = code;

          if (activeTab === 'github') {
              if (!repoUrl.trim()) {
                  throw new Error("Please enter a repository URL");
              }
              contentToAnalyze = await scanRepository(repoUrl, githubToken, (status) => setScanStatus(status));
          } else {
              if (!code.trim()) return;
          }
          
          setScanStatus("Generating Architecture Graph...");
          await onImport(contentToAnalyze);
          onClose();
          
      } catch (e) {
          console.error(e);
          setErrorMsg((e as Error).message || "Failed to process input");
      } finally {
          setIsAnalyzing(false);
          setScanStatus('');
      }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700 bg-slate-900">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Code2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Code to Flow</h2>
                    <p className="text-sm text-slate-400">Transform code or repositories into diagrams.</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
            <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'paste' 
                    ? 'text-white border-b-2 border-indigo-500 bg-slate-800' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
                <FileCode className="w-4 h-4" />
                Paste Code
            </button>
            <button
                onClick={() => setActiveTab('github')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'github' 
                    ? 'text-white border-b-2 border-indigo-500 bg-slate-800' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
                <Github className="w-4 h-4" />
                Scan Repository
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden bg-[#0f172a] relative">
             
             {/* PASTE TAB */}
             {activeTab === 'paste' && (
                 <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Supports <strong>Docker Compose</strong>, <strong>Terraform</strong>, <strong>K8s YAML</strong>, and <strong>Python/JS Logic</strong>.</span>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={`Paste your code here...\n\nExample:\n\nservices:\n  web:\n    image: nginx\n  db:\n    image: postgres:14`}
                            className="w-full h-full bg-[#1e293b] border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed custom-scrollbar"
                            spellCheck={false}
                        />
                    </div>
                 </div>
             )}

             {/* GITHUB TAB */}
             {activeTab === 'github' && (
                 <div className="flex-1 flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Repository Scanner
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            We will traverse the repository to find architecture-defining files (e.g., <code className="bg-slate-800 px-1 rounded text-slate-300">docker-compose</code>, <code className="bg-slate-800 px-1 rounded text-slate-300">terraform</code>, <code className="bg-slate-800 px-1 rounded text-slate-300">package.json</code>) and use them to reconstruct the system design.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                Repository URL
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/owner/repo"
                                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                    Personal Access Token (Optional)
                                </label>
                                <span className="text-[10px] text-slate-500">Required for Private Repos</span>
                            </div>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input 
                                    type="password"
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                    placeholder="ghp_xxxxxxxxxxxx"
                                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                                * Your token is sent directly to GitHub API and is never stored on our servers.
                            </p>
                        </div>
                    </div>
                 </div>
             )}

             {/* Error Message */}
             {errorMsg && (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2">
                     <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                     <p className="text-xs text-red-300 font-medium">{errorMsg}</p>
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
             <div className="text-xs text-indigo-400 font-medium animate-pulse">
                 {isAnalyzing ? (scanStatus || "Processing...") : ""}
             </div>

             <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleVisualize}
                    disabled={(activeTab === 'paste' && !code.trim()) || (activeTab === 'github' && !repoUrl.trim()) || isAnalyzing}
                    className={`
                        px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg transition-all
                        ${(activeTab === 'paste' && !code.trim()) || (activeTab === 'github' && !repoUrl.trim()) || isAnalyzing
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
                        }
                    `}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {activeTab === 'github' ? 'Scanning...' : 'Analyzing...'}
                        </>
                    ) : (
                        <>
                            Visualize Structure
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
             </div>
        </div>

      </div>
    </div>
  );
};

export default CodeImportModal;
