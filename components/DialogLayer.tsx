
import React from 'react';
import CodeViewer from './CodeViewer';
import AIResponseViewer from './AIResponseViewer';
import HistoryViewer from './HistoryViewer';
import AuditPanel from './AuditPanel';
import CostSummary from './CostSummary';
import CodeImportModal from './CodeImportModal';
import ChatInterface from './ChatInterface';
import LoadingOverlay from './LoadingOverlay';
import { ToastContainer } from './Toast';
import { HistoryItem, AuditIssue, ChatMessage, CodeLanguage, ToastMessage } from '../types';

interface DialogLayerProps {
    // Audit
    showAuditPanel: boolean;
    auditIssues: AuditIssue[];
    onCloseAudit: () => void;
    onFocusNode: (id: string) => void;

    // Cost
    showCostSummary: boolean;
    costBreakdown: any[];
    totalCost: number;
    onCloseCost: () => void;

    // Chat
    showChat: boolean;
    chatMessages: ChatMessage[];
    onSendMessage: (text: string) => Promise<void>;
    onCloseChat: () => void;
    onResetHighlights: () => void;
    isChatProcessing: boolean;

    // Code
    showCodeViewer: boolean;
    generatedCode: string;
    codeLanguage: string;
    onCloseCodeViewer: () => void;
    
    // Code Import
    showCodeImportModal: boolean;
    onCloseCodeImport: () => void;
    onImportCode: (code: string) => Promise<void>;

    // AI Response / Rationale
    aiResponse: { title: string; content: string } | null;
    onCloseAIResponse: () => void;

    // History
    showHistory: boolean;
    history: HistoryItem[];
    onCloseHistory: () => void;
    onSelectHistory: (item: HistoryItem) => void;
    onClearHistory: () => void;
    onDeleteHistory: (id: string) => void;
    onCompareHistory: (item1: HistoryItem, item2: HistoryItem) => void;

    // Diff Mode
    isDiffMode: boolean;
    onExitDiff: () => void;

    // Loading & Toasts
    isGenerating: boolean;
    loadingMessage?: string;
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

export const DialogLayer: React.FC<DialogLayerProps> = ({
    showAuditPanel, auditIssues, onCloseAudit, onFocusNode,
    showCostSummary, costBreakdown, totalCost, onCloseCost,
    showChat, chatMessages, onSendMessage, onCloseChat, onResetHighlights, isChatProcessing,
    showCodeViewer, generatedCode, codeLanguage, onCloseCodeViewer,
    showCodeImportModal, onCloseCodeImport, onImportCode,
    aiResponse, onCloseAIResponse,
    showHistory, history, onCloseHistory, onSelectHistory, onClearHistory, onDeleteHistory, onCompareHistory,
    isDiffMode, onExitDiff,
    isGenerating, loadingMessage, toasts, removeToast
}) => {
    return (
        <>
            {/* PANELS */}
            {showAuditPanel && <AuditPanel issues={auditIssues} onClose={onCloseAudit} onFocusNode={onFocusNode} />}
            {showCostSummary && <CostSummary breakdown={costBreakdown} total={totalCost} onClose={onCloseCost} />}
            
            {showChat && (
                <ChatInterface 
                    messages={chatMessages} 
                    onSendMessage={onSendMessage} 
                    onClose={onCloseChat} 
                    onResetHighlights={onResetHighlights}
                    isProcessing={isChatProcessing}
                />
            )}

            {/* MODALS */}
            {showCodeViewer && (
                <CodeViewer 
                    code={generatedCode} 
                    language={codeLanguage} 
                    onClose={onCloseCodeViewer} 
                />
            )}

            {aiResponse && (
                <AIResponseViewer 
                    title={aiResponse.title} 
                    content={aiResponse.content} 
                    onClose={onCloseAIResponse} 
                />
            )}
            
            {showHistory && (
                <HistoryViewer 
                    history={history} 
                    onClose={onCloseHistory} 
                    onSelect={onSelectHistory}
                    onClear={onClearHistory}
                    onDelete={onDeleteHistory}
                    onCompare={onCompareHistory}
                />
            )}
            
            {showCodeImportModal && (
                <CodeImportModal
                    onClose={onCloseCodeImport}
                    onImport={onImportCode}
                />
            )}

            {/* OVERLAYS */}
            {isGenerating && <LoadingOverlay message={loadingMessage} />}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* DIFF MODE BANNER */}
            {isDiffMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[4500] flex items-center gap-3 px-6 py-2 bg-slate-900/95 border border-indigo-500 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Diff View</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Added
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>Modified
                        </span>
                        <span className="flex items-center gap-1.5 text-red-400">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>Removed
                        </span>
                    </div>
                    <button onClick={onExitDiff} className="ml-2 text-slate-400 hover:text-white">✕</button>
                </div>
            )}
        </>
    );
};
