
import React, { useState } from 'react';
import {
    Lock, Unlock, Undo, Redo, GitCompare, ArrowDownUp, ArrowRightLeft,
    Route, Activity, FolderOpen, Folder, Scan, Box, MessageSquare,
    BookOpen, Code2, ChevronUp, ChevronDown, Play, RefreshCcw, Globe, Check
} from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { CodeLanguage } from '../types';

interface TopToolbarProps {
    isReadOnly: boolean;
    onToggleReadOnly: () => void;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    isPeeking: boolean;
    setIsPeeking: (peeking: boolean) => void;

    layoutDirection: 'LR' | 'TB';
    onToggleLayout: () => void;
    onCycleEdgeType: () => void;

    globalAnimated: boolean;
    onToggleAnimation: () => void;

    areGroupsExpanded: boolean;
    onToggleSubflows: () => void;

    areGroupsTransparent: boolean;
    onToggleGroupTransparency: () => void;

    nodeCount: number;
    onStartPresentation: () => void;

    // New: Force Layout
    onForceLayout?: () => void;

    // New: Global Language
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
    { code: 'English', label: 'English', short: 'EN' },
    { code: 'Spanish', label: 'Español', short: 'ES' },
    { code: 'Portuguese', label: 'Português', short: 'PT' },
    { code: 'French', label: 'Français', short: 'FR' },
    { code: 'German', label: 'Deutsch', short: 'DE' },
    { code: 'Chinese', label: '中文', short: 'CN' },
];

const TopToolbar: React.FC<TopToolbarProps> = ({
    isReadOnly,
    onToggleReadOnly,
    canUndo,
    canRedo,
    undo,
    redo,
    isPeeking,
    setIsPeeking,
    layoutDirection,
    onToggleLayout,
    onCycleEdgeType,
    globalAnimated,
    onToggleAnimation,
    areGroupsExpanded,
    onToggleSubflows,
    areGroupsTransparent,
    onToggleGroupTransparency,
    nodeCount,
    onStartPresentation,
    onForceLayout,
    currentLanguage,
    onLanguageChange
}) => {
    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
    const [isCodeMenuOpen, setIsCodeMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

    return (
        <div className="absolute top-0 w-full flex justify-center z-[4000] pointer-events-none">
            <div className={`pointer-events-auto mt-2 sm:mt-4 transition-transform duration-300 flex flex-col items-center ${isToolbarCollapsed ? '-translate-y-[calc(100%-20px)]' : 'translate-y-0'}`}>

                {/* Main Toolbar */}
                <div className={`flex items-center gap-1 p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-visible flex-wrap justify-center transition-opacity duration-300 ${isToolbarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                    {/* --- LANGUAGE SELECTOR (GLOBAL) --- */}
                    <div className={`relative shrink-0 ${isLangMenuOpen ? 'z-[101]' : ''}`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLangMenuOpen(!isLangMenuOpen);
                                setIsCodeMenuOpen(false);
                            }}
                            className={`h-9 flex items-center gap-2 px-3 rounded-lg transition-all focus:outline-none border ${isLangMenuOpen ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            title="Change Language"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-bold">{currentLangObj.short}</span>
                        </button>

                        {isLangMenuOpen && (
                            <div className="absolute top-full left-0 mt-3 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/50 border-b border-slate-700/50">
                                    Language
                                </div>
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            onLanguageChange(lang.code);
                                            setIsLangMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${currentLanguage === lang.code ? 'bg-indigo-600/10 text-indigo-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        <span>{lang.label}</span>
                                        {currentLanguage === lang.code && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-5 bg-slate-700/50 mx-1 shrink-0"></div>

                    <button
                        onClick={onToggleReadOnly}
                        className={`h-9 flex items-center gap-2 px-3 rounded-lg transition-all focus:outline-none border shrink-0 ${isReadOnly
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/50'
                                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        title={isReadOnly ? "Unlock Editing" : "Lock / Presentation Mode"}
                    >
                        {isReadOnly ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        <span className="text-xs font-semibold">{isReadOnly ? 'Locked' : 'Edit'}</span>
                    </button>

                    <div className="w-px h-5 bg-slate-700/50 mx-1 shrink-0"></div>

                    {/* --- UNDO / REDO / DIFF BUTTONS --- */}
                    <button
                        onClick={undo}
                        disabled={!canUndo || isPeeking}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent shrink-0 ${!canUndo || isPeeking
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo || isPeeking}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent shrink-0 ${!canRedo || isPeeking
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={() => {
                            if (canUndo && !isPeeking) {
                                setIsPeeking(true);
                                undo();
                            }
                        }}
                        onMouseUp={() => {
                            if (canRedo && isPeeking) {
                                redo();
                                setIsPeeking(false);
                            }
                        }}
                        onMouseLeave={() => {
                            if (canRedo && isPeeking) {
                                redo();
                                setIsPeeking(false);
                            }
                        }}
                        disabled={!canUndo}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent shrink-0 ${!canUndo
                                ? 'text-slate-600 cursor-not-allowed'
                                : isPeeking
                                    ? 'text-white bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                    : 'text-indigo-400 hover:text-white hover:bg-indigo-500/20'
                            }`}
                        title="Hold to Peek Previous State (Diff)"
                    >
                        <GitCompare className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-700/50 mx-1 shrink-0"></div>

                    {/* --- VIEW / EDGE CONTROLS --- */}
                    {onForceLayout && (
                        <button
                            onClick={onForceLayout}
                            className="h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                            title="Recalculate Layout (Auto-Arrange)"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={onToggleLayout}
                        className="h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title="Rotate Layout"
                    >
                        {layoutDirection === 'LR' ? <ArrowDownUp className="w-4 h-4" /> : <ArrowRightLeft className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={onCycleEdgeType}
                        className="h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title="Cycle Edge Style"
                    >
                        <Route className="w-4 h-4" />
                    </button>

                    <button
                        onClick={onToggleAnimation}
                        className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent shrink-0 ${globalAnimated ? 'text-indigo-400 hover:text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Toggle Traffic Animation"
                    >
                        <Activity className="w-4 h-4" />
                    </button>

                    {/* GROUP CONTROLS */}
                    <button
                        onClick={onToggleSubflows}
                        className="h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title={areGroupsExpanded ? "Collapse Groups" : "Expand Groups"}
                    >
                        {areGroupsExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={onToggleGroupTransparency}
                        className="h-9 w-9 flex items-center justify-center rounded-lg transition-all focus:outline-none border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title={areGroupsTransparent ? "Show Group Borders" : "Hide Group Borders (Clean View)"}
                    >
                        {areGroupsTransparent ? <Scan className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                    </button>

                    <div className="w-px h-5 bg-slate-700/50 mx-1 shrink-0"></div>

                    {/* --- ADVANCED TOOLS --- */}

                    {nodeCount > 2 && (
                        <button
                            onClick={onStartPresentation}
                            className="h-9 flex items-center gap-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white font-semibold text-xs shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all focus:outline-none border border-transparent shrink-0"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Present
                        </button>
                    )}

                </div>

                {/* Collapsible Tab Handle */}
                <button
                    onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
                    className="h-3 w-16 bg-slate-800 rounded-b-lg border-b border-x border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer -mt-px z-10 shadow-sm group"
                >
                    {isToolbarCollapsed ? <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" /> : <ChevronUp className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />}
                </button>
            </div>
        </div>
    );
};

export default TopToolbar;
