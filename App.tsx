
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactFlow, { Controls, ControlButton, MiniMap, Background, Node } from 'reactflow';
import Sidebar from './components/Sidebar';
import CustomNode from './components/CustomNode';
import GroupNode from './components/GroupNode';
import TitleNode from './components/TitleNode';
import DefsNode from './components/DefsNode';
import CustomEdge from './components/CustomEdge';
import DownloadBtn from './components/DownloadBtn';
import Background3D from './components/Background3D';
import StaticBackground from './components/StaticBackground'; // IMPORTED
import ContextMenu from './components/ContextMenu';
import TopToolbar from './components/TopToolbar';
import PresentationControls from './components/PresentationControls';
import WelcomeScreen from './components/WelcomeScreen';
import BreadcrumbNav from './components/BreadcrumbNav';
import { DialogLayer } from './components/DialogLayer';
import { TechStackBar, DiagramLegend } from './components/CanvasOverlays';

import { useFlowController } from './hooks/useFlowController';
import { useUndoRedo } from './hooks/useUndoRedo';
import { usePresentation } from './hooks/usePresentation';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getLayoutedElements } from './utils/layout';
import { DiagramType, NodeData, HistoryItem, ToastMessage, ToastType } from './types';
import { THEME } from './theme';
import { Map, MapPinOff, Maximize } from 'lucide-react';

const initialNodes: any[] = [{ id: 'defs-node', type: 'defs', position: { x: 0, y: 0 }, data: { label: '' }, zIndex: -1 }];
const initialEdges: any[] = [];

const App = () => {
    // --- UI STATE ---
    const [viewMode, setViewMode] = useState<any>('Architecture');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isPeeking, setIsPeeking] = useState(false);
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [isLowPowerMode, setIsLowPowerMode] = useState(false);
    const [isSketchMode, setIsSketchMode] = useState(false);
    const [menuData, setMenuData] = useState<{ x: number, y: number, nodeId: string } | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // New: Language State
    const [currentLanguage, setCurrentLanguage] = useState('English');

    // History State
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isDiffMode, setIsDiffMode] = useState(false);

    // Navigation Stack (Drill Down)
    const [navigationStack, setNavigationStack] = useState<{ nodes: any[], edges: any[], title: string, diagramType: DiagramType }[]>([]);

    // --- HELPERS ---
    const addToast = useCallback((title: string, message: string, type: ToastType = 'info') => {
        setToasts(prev => [...prev, { id: Math.random().toString(), title, message, type }]);
    }, []);
    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    // --- HOOKS ---
    const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(initialNodes, initialEdges);

    const flow = useFlowController(initialNodes, initialEdges, takeSnapshot, addToast);

    // Undo/Redo Handlers
    const handleUndo = () => undo(flow.nodes, flow.edges, flow.setNodes, flow.setEdges);
    const handleRedo = () => redo(flow.nodes, flow.edges, flow.setNodes, flow.setEdges);

    const presentation = usePresentation({
        nodes: flow.nodes, edges: flow.edges, rfInstance: flow.rfInstance,
        setSelectedNode: flow.setSelectedNode, setIsReadOnly, handleFitView: flow.handleFitView, addToast
    });

    useKeyboardShortcuts(handleUndo, handleRedo, flow.nodes, flow.edges);

    // --- EFFECTS ---
    useEffect(() => {
        document.body.classList.toggle('low-power-mode', isLowPowerMode);
        document.body.classList.toggle('sketch-mode', isSketchMode);
        // Sync Sketch Mode
        flow.setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isSketchMode } })));
        flow.setEdges(eds => eds.map(e => ({ ...e, data: { ...e.data, isSketchMode } })));
    }, [isLowPowerMode, isSketchMode, flow.setNodes, flow.setEdges]);

    // --- HANDLERS ---
    const handleNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
        e.preventDefault();
        if (isReadOnly) return;
        setMenuData({ x: e.clientX, y: e.clientY, nodeId: node.id });
        flow.setSelectedNode(node);
    }, [isReadOnly, flow.setSelectedNode]);

    const handleContextMenuAction = async (action: string) => {
        if (!menuData) return;
        const node = flow.nodes.find(n => n.id === menuData.nodeId);
        if (!node) return;

        if (action === 'drill_down') {
            // Push current state to stack
            setNavigationStack(prev => [...prev, {
                nodes: flow.nodes,
                edges: flow.edges,
                title: node.data.label,
                diagramType: flow.currentDiagramType
            }]);

            flow.setNodes([{ id: 'defs-node', type: 'defs', position: { x: 0, y: 0 }, data: { label: '' }, zIndex: -1 }]);
            flow.setEdges([]);
        }
        setMenuData(null);
    };

    const handleBreadcrumbNavigate = (index: number) => {
        if (index === -1) {
            // Go to Root (Initial State if stack has items)
            if (navigationStack.length > 0) {
                const root = navigationStack[0];
                flow.setNodes(root.nodes);
                flow.setEdges(root.edges);
                flow.setCurrentDiagramType(root.diagramType);
                setNavigationStack([]);
            }
        } else {
            // Go to specific level
            // The target state is actually the state *before* the drill down at that index + 1
            // BUT simpler logic: restore the state stored AT that index, then slice stack
            const targetState = navigationStack[index];
            flow.setNodes(targetState.nodes);
            flow.setEdges(targetState.edges);
            flow.setCurrentDiagramType(targetState.diagramType);
            setNavigationStack(prev => prev.slice(0, index));
        }
    };

    const handleQuickStart = (prompt: string, type: DiagramType) => {
        flow.setCurrentDiagramType(type);
        flow.setNodes([{ id: 'defs-node', type: 'defs', position: { x: 0, y: 0 }, data: { label: '' }, zIndex: -1 }]);
        flow.setEdges([]);
    };

    // --- RENDER ---
    const nodeTypes = useMemo(() => ({ custom: CustomNode, title: TitleNode, defs: DefsNode, group: GroupNode }), []);
    const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

    // Determine if canvas is effectively empty (just defs/title or <2 nodes)
    const isCanvasEmpty = flow.nodes.filter(n => n.type !== 'defs' && n.type !== 'title').length === 0;

    return (
        <div className="flex w-full h-screen bg-[#0f172a] text-slate-200 font-sans">
            <Sidebar
                onImport={flow.handleImport}
                onReset={flow.handleReset}
                onViewModeChange={setViewMode}
                onUpdateNode={flow.handleUpdateNode}
                onDeleteNode={flow.handleDeleteNode}
                onShowHistory={() => setShowHistory(true)}
                selectedNode={flow.selectedNode}
                currentViewMode={viewMode}
                onAddNode={flow.handleAddNode}
                onAddGroup={flow.handleAddGroup}
                onAddTextNode={flow.handleAddTextNode}
                onCycleEdgeType={flow.cycleEdgeType}
                onToggleAnimation={flow.toggleEdgeAnimation}
                globalAnimated={flow.globalAnimated}
                hasData={!isCanvasEmpty}
                canUndo={canUndo} canRedo={canRedo} onUndo={handleUndo} onRedo={handleRedo}
                isReadOnly={isReadOnly}
                onToast={addToast}
                isLowPowerMode={isLowPowerMode} onToggleLowPowerMode={() => setIsLowPowerMode(!isLowPowerMode)}
                isSketchMode={isSketchMode} onToggleSketchMode={() => setIsSketchMode(!isSketchMode)}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
            />

            <div className={`flex-1 h-full relative overflow-hidden ${isSketchMode ? 'bg-white' : 'bg-[#0f172a]'}`}>

                {/* BACKGROUND HANDLING */}
                {!isSketchMode && (
                    isLowPowerMode ? <StaticBackground /> : <Background3D />
                )}

                {/* EMPTY STATE / WELCOME */}
                {isCanvasEmpty && (
                    <WelcomeScreen onQuickStart={handleQuickStart} />
                )}

                {/* OVERLAYS & DIALOGS */}
                <DialogLayer
                    showHistory={showHistory} history={history} onCloseHistory={() => setShowHistory(false)} onSelectHistory={() => { }} onClearHistory={() => setHistory([])} onDeleteHistory={() => { }} onCompareHistory={() => { }}
                    isDiffMode={isDiffMode} onExitDiff={() => setIsDiffMode(false)}
                    toasts={toasts} removeToast={removeToast}
                />

                {/* NAVIGATION BAR (Drill Down) */}
                {navigationStack.length > 0 && (
                    <BreadcrumbNav stack={navigationStack} onNavigate={handleBreadcrumbNavigate} />
                )}

                {/* PRESENTATION CONTROLS (Only visible in presentation mode) */}
                {presentation.isPresentationMode && (
                    <PresentationControls
                        currentStep={presentation.presentationStep}
                        totalSteps={flow.nodes.filter(n => n.type !== 'title' && n.type !== 'defs' && n.type !== 'group').length}
                        isPlaying={presentation.isPlaying}
                        strategy={presentation.strategy}
                        onNext={presentation.nextSlide}
                        onPrev={presentation.prevSlide}
                        onTogglePlay={presentation.togglePlay}
                        onExit={presentation.stopPresentation}
                        onChangeStrategy={presentation.setStrategy}
                    />
                )}

                <ReactFlow
                    nodes={flow.nodes} edges={flow.edges}
                    nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                    onNodesChange={flow.onNodesChange} onEdgesChange={flow.onEdgesChange}
                    onConnect={flow.onConnect}
                    onNodeClick={(e, n) => { setMenuData(null); flow.setSelectedNode(n); }}
                    onNodeDragStart={flow.onNodeDragStart}
                    onNodeContextMenu={handleNodeContextMenu}
                    onInit={flow.setRfInstance}
                    fitView className="bg-transparent relative z-10" minZoom={0.05} maxZoom={3}
                >
                    {!presentation.isPresentationMode && (
                        <Controls
                            className="!bg-slate-900 !border-slate-700 !text-slate-400 !fill-current"
                            showInteractive={false}
                            showFitView={false} // Disable default fit view
                            showZoom={true}
                        >
                            <ControlButton
                                onClick={flow.handleFitView} // Use CUSTOM fit view logic
                                title="Fit View"
                                className="!bg-slate-900 !border-slate-700 !text-slate-400 hover:!text-white hover:!bg-slate-800"
                            >
                                <Maximize className="w-4 h-4" />
                            </ControlButton>

                            <ControlButton
                                onClick={() => setShowMiniMap(!showMiniMap)}
                                title={showMiniMap ? "Hide Mini Map" : "Show Mini Map"}
                                className="!bg-slate-900 !border-slate-700 !text-slate-400 hover:!text-white hover:!bg-slate-800"
                            >
                                {showMiniMap ? <MapPinOff className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                            </ControlButton>
                        </Controls>
                    )}

                    {showMiniMap && (
                        <MiniMap
                            className="!bg-slate-900 border border-slate-800 shadow-2xl"
                            nodeColor="#64748b"
                            maskColor="rgba(15, 23, 42, 0.4)"
                            zoomable
                            pannable
                        />
                    )}

                    {/* TOP TOOLBAR (Hidden in Presentation) */}
                    {!presentation.isPresentationMode && (
                        <TopToolbar
                            isReadOnly={isReadOnly} onToggleReadOnly={() => setIsReadOnly(!isReadOnly)}
                            canUndo={canUndo} canRedo={canRedo} undo={handleUndo} redo={handleRedo}
                            isPeeking={isPeeking} setIsPeeking={setIsPeeking}

                            layoutDirection={flow.layoutDirection} onToggleLayout={flow.onToggleLayout}

                            onCycleEdgeType={flow.cycleEdgeType}

                            globalAnimated={flow.globalAnimated}
                            onToggleAnimation={flow.toggleEdgeAnimation}

                            areGroupsExpanded={flow.areGroupsExpanded}
                            onToggleSubflows={flow.toggleAllGroups}

                            areGroupsTransparent={flow.areGroupsTransparent}
                            onToggleGroupTransparency={flow.toggleGroupTransparency}

                            nodeCount={flow.nodes.length}
                            onStartPresentation={presentation.startPresentation}
                            onForceLayout={flow.onForceLayout}

                            currentLanguage={currentLanguage}
                            onLanguageChange={setCurrentLanguage}
                        />
                    )}

                    {menuData && <ContextMenu x={menuData.x} y={menuData.y} nodeLabel="" onClose={() => setMenuData(null)} onAction={handleContextMenuAction} />}
                    <DownloadBtn />
                    <TechStackBar nodes={flow.nodes} />

                    <DiagramLegend currentType={flow.currentDiagramType} />

                </ReactFlow>
            </div>
        </div>
    );
};

export default App;
