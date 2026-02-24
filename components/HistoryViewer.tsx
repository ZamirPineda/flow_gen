
import React, { useState } from 'react';
import { X, FileCode, Sparkles, Clock, Trash2, ChevronRight, History as HistoryIcon, GitCompare, CheckSquare, Square } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryViewerProps {
    history: HistoryItem[];
    onClose: () => void;
    onSelect: (item: HistoryItem) => void;
    onClear: () => void;
    onDelete: (id: string) => void;
    onCompare?: (item1: HistoryItem, item2: HistoryItem) => void; // New Prop
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ history, onClose, onSelect, onClear, onDelete, onCompare }) => {
    
    // Compare Mode State
    const [compareMode, setCompareMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const formatDate = (timestamp: number) => {
        if (!timestamp || isNaN(timestamp)) return 'Unknown Date';
        try {
            const date = new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
            }).format(date);
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(item => item !== id));
        } else {
            if (selectedIds.length < 2) {
                setSelectedIds(prev => [...prev, id]);
            }
        }
    };

    const handleCompareClick = () => {
        if (selectedIds.length !== 2) return;
        const item1 = history.find(h => h.id === selectedIds[0]);
        const item2 = history.find(h => h.id === selectedIds[1]);
        if (item1 && item2 && onCompare) {
            onCompare(item1, item2);
            onClose(); // Close modal
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-96 h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="w-5 h-5 text-indigo-400" />
                            <h2 className="font-bold text-white text-lg">Timeline</h2>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Compare Toggle */}
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                        <span className="text-xs font-semibold text-slate-300 ml-1">Diff Mode</span>
                        <button 
                            onClick={() => {
                                setCompareMode(!compareMode);
                                setSelectedIds([]); // Reset
                            }}
                            className={`
                                relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                                ${compareMode ? 'bg-indigo-600' : 'bg-slate-600'}
                            `}
                        >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${compareMode ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center">
                            <Clock className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm">No history yet.</p>
                            <p className="text-xs opacity-60 mt-1">Generate code or ask for explanations to populate this list.</p>
                        </div>
                    ) : (
                        history.map((item) => {
                            // Filter out items that don't have graph snapshots if in compare mode (optional, but good UX)
                            // Assuming most history items might save snapshots implicitly or we only compare those that do.
                            // For now, we allow all, but diff might fail if no snapshot data.
                            
                            const isSelected = selectedIds.includes(item.id);
                            const canSelect = selectedIds.length < 2 || isSelected;

                            return (
                                <div 
                                    key={item.id}
                                    className={`
                                        group relative border rounded-lg p-3 transition-all cursor-pointer
                                        ${compareMode && isSelected 
                                            ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500' 
                                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30'
                                        }
                                        ${compareMode && !canSelect ? 'opacity-50' : ''}
                                    `}
                                    onClick={() => {
                                        if (compareMode) toggleSelection(item.id);
                                        else onSelect(item);
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {compareMode && (
                                                <div className={`text-indigo-400 ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
                                                    {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                </div>
                                            )}
                                            
                                            <div className={`p-1.5 rounded-md ${item.type === 'code' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {item.type === 'code' ? <FileCode className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.type === 'code' ? 'text-blue-300' : 'text-purple-300'}`}>
                                                {item.type === 'code' ? item.language || 'Code' : 'Insight'}
                                            </span>
                                        </div>
                                        {!compareMode && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-sm font-medium text-slate-200 mb-1 line-clamp-2 leading-snug">
                                        {item.title}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                                        <span>{formatDate(item.timestamp)}</span>
                                        {!compareMode && (
                                            <span className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Open <ChevronRight className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    {compareMode ? (
                        <button 
                            onClick={handleCompareClick}
                            disabled={selectedIds.length !== 2}
                            className={`
                                w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition-all
                                ${selectedIds.length === 2 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                }
                            `}
                        >
                            <GitCompare className="w-3.5 h-3.5" />
                            Compare Versions ({selectedIds.length}/2)
                        </button>
                    ) : (
                        history.length > 0 && (
                            <button 
                                onClick={onClear}
                                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear History
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryViewer;
