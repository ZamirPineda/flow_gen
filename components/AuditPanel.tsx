

import React from 'react';
import { AlertTriangle, ShieldAlert, X, ChevronRight, CheckCircle, Target } from 'lucide-react';
import { AuditIssue } from '../types';

interface AuditPanelProps {
    issues: AuditIssue[];
    onClose: () => void;
    onFocusNode: (nodeId: string) => void;
}

const AuditPanel: React.FC<AuditPanelProps> = ({ issues, onClose, onFocusNode }) => {
    
    // Sort critical first
    const sortedIssues = [...issues].sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return 0;
    });

    const criticalCount = issues.filter(i => i.severity === 'critical').length;

    return (
        <div className="absolute top-20 right-6 w-80 bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl overflow-hidden z-[4000] animate-in slide-in-from-right-10 fade-in duration-300 flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className={`p-4 border-b ${criticalCount > 0 ? 'bg-red-950/30 border-red-500/30' : 'bg-amber-950/30 border-amber-500/30'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${criticalCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Security Audit</h3>
                        <p className="text-xs opacity-70 flex items-center gap-1">
                            {criticalCount > 0 ? (
                                <span className="text-red-400 font-semibold">{criticalCount} Critical Issues</span>
                            ) : (
                                <span className="text-amber-400 font-semibold">{issues.length} Warnings Found</span>
                            )}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {sortedIssues.map(issue => (
                    <div 
                        key={issue.id} 
                        className={`
                            relative group p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02]
                            ${issue.severity === 'critical' 
                                ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10' 
                                : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10'
                            }
                        `}
                        onClick={() => onFocusNode(issue.nodeId)}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${issue.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                {issue.severity}
                            </span>
                            <Target className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <h4 className="text-xs font-bold text-slate-200 mb-1">{issue.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-snug mb-2">{issue.description}</p>
                        
                        <div className={`text-[10px] flex gap-2 p-2 rounded ${issue.severity === 'critical' ? 'bg-red-950/30 text-red-200' : 'bg-amber-950/30 text-amber-200'}`}>
                            <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>Fix: {issue.remediation}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-center">
                <p className="text-[10px] text-slate-600">
                    Click an issue to locate the component
                </p>
            </div>
        </div>
    );
};

export default AuditPanel;