
import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node, MarkerType, ReactFlowInstance } from 'reactflow';
import { getLayoutedElements } from '../utils/layout';
import { DiagramType, NodeData } from '../types';
import { diagramStateSchema } from '../utils/schema';
import { THEME } from '../theme';
import _ from 'lodash';

// Helper to determine palette
const getThemePalette = (type: DiagramType): string[] => {
    switch (type) {
        case DiagramType.DATA_ENGINEERING: return [THEME.colors.dataEngineering.storage, THEME.colors.dataEngineering.compute, THEME.colors.dataEngineering.stream, THEME.colors.dataEngineering.ingestion, THEME.colors.dataEngineering.orchestration];
        case DiagramType.CLOUD_ARCH: return [THEME.colors.cloud.compute, THEME.colors.cloud.network, THEME.colors.cloud.storage, THEME.colors.cloud.security, THEME.colors.cloud.database];

        case DiagramType.SECURITY: return [THEME.colors.security.policy, THEME.colors.security.firewall, THEME.colors.security.asset, THEME.colors.security.user];
        case DiagramType.BACKEND_DESIGN: return ['#94a3b8'];
        default: return [THEME.colors.standard.client, THEME.colors.standard.database, THEME.colors.standard.cloud, THEME.colors.standard.queue, THEME.colors.standard.ai];
    }
};

const STORAGE_KEY = 'flowgen-diagram-state-v5';

export const useFlowController = (
    initialNodes: Node[],
    initialEdges: Edge[],
    takeSnapshot: (n: Node[], e: Edge[]) => void,
    addToast: (title: string, msg: string, type?: any) => void
) => {
    // --- STATE INITIALIZATION WITH PERSISTENCE ---
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
    const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('LR');
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

    // Global State Trackers
    const [globalAnimated, setGlobalAnimated] = useState(true);
    const [globalEdgeType, setGlobalEdgeType] = useState('default');
    const [areGroupsExpanded, setAreGroupsExpanded] = useState(true);
    const [areGroupsTransparent, setAreGroupsTransparent] = useState(false);
    const [currentDiagramType, setCurrentDiagramType] = useState<DiagramType>(DiagramType.DATA_ENGINEERING);

    // --- RESTORE FROM LOCAL STORAGE ON MOUNT ---
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const result = diagramStateSchema.safeParse(parsed);
                if (result.success) {
                    const data = result.data;
                    if (data.nodes && data.nodes.length > 0) {
                        setNodes(data.nodes as Node[]);
                        setEdges(data.edges as Edge[] || []);
                        if (data.layoutDirection) setLayoutDirection(data.layoutDirection as any);
                        if (data.currentDiagramType) setCurrentDiagramType(data.currentDiagramType as any);
                    }
                } else {
                    console.warn("Invalid saved diagram state format", result.error);
                }
            } catch (e) {
                console.error("Failed to load saved diagram", e);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // --- AUTO-SAVE DEBOUNCED ---
    useEffect(() => {
        if (!nodes || nodes.length <= 1) return; // Don't save empty/default states basically

        const saveToStorage = _.debounce(() => {
            const stateToSave = {
                nodes,
                edges,
                layoutDirection,
                currentDiagramType,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }, 1000);

        saveToStorage();
        return () => saveToStorage.cancel();
    }, [nodes, edges, layoutDirection, currentDiagramType]);


    const handleFitView = useCallback(() => {
        if (rfInstance) {
            setTimeout(() => {
                rfInstance.fitView({ padding: 0.2, duration: 800, minZoom: 0.05, maxZoom: 2, includeHiddenNodes: true });
            }, 50);
        }
    }, [rfInstance]);

    // NEW: Capture state before dragging starts to enable Undo for movements
    const onNodeDragStart = useCallback(() => {
        takeSnapshot(nodes, edges);
    }, [nodes, edges, takeSnapshot]);

    const onNodeDragStop = useCallback((e: React.MouseEvent, node: Node) => {
        // Prevent groups from being grouped inside other groups for simplicity
        if (node.type === 'group' || node.type === 'defs' || node.type === 'title') return;

        setNodes((nds) => {
            // Find expanded groups that could potential be a target
            const groupNodes = nds.filter(n => n.type === 'group' && n.id !== node.id && !n.data.collapsed);
            let nextParentId: string | undefined = undefined;

            for (const group of groupNodes) {
                // Calculate node center. Default width/height used if none available
                const nodeCenterX = node.position.x + 100; // ~half width
                const nodeCenterY = node.position.y + 100; // ~half height

                const groupW = group.style?.width || Number(group.data.expandedWidth) || 400;
                const groupH = group.style?.height || Number(group.data.expandedHeight) || 400;

                const groupX = group.position.x;
                const groupY = group.position.y;

                if (
                    nodeCenterX > groupX &&
                    nodeCenterX < groupX + Number(groupW) &&
                    nodeCenterY > groupY &&
                    nodeCenterY < groupY + Number(groupH)
                ) {
                    nextParentId = group.id;
                    break;
                }
            }

            return nds.map((n) => {
                if (n.id === node.id) {
                    if (nextParentId && n.parentNode !== nextParentId) {
                        const parent = nds.find(p => p.id === nextParentId);
                        if (parent) {
                            return {
                                ...n,
                                parentNode: nextParentId,
                                // Convert to relative coordinates inside the group
                                position: {
                                    x: node.position.x - parent.position.x,
                                    y: node.position.y - parent.position.y
                                }
                            };
                        }
                    } else if (!nextParentId && n.parentNode) {
                        // Dragged out of a group
                        const parent = nds.find(p => p.id === n.parentNode);
                        if (parent) {
                            return {
                                ...n,
                                parentNode: undefined,
                                // Convert back to absolute coordinates
                                position: {
                                    x: node.position.x + parent.position.x,
                                    y: node.position.y + parent.position.y
                                }
                            };
                        }
                    }
                }
                return n;
            });
        });
    }, [setNodes]);

    const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedContent = JSON.parse(content);
                const result = diagramStateSchema.safeParse(parsedContent);

                if (result.success && result.data.nodes && result.data.edges) {
                    const flowData = result.data;
                    takeSnapshot(nodes, edges);

                    // PRE-PROCESS NODES TO FIX GROUPS & SYNC STATE
                    let hasGroups = false;
                    let anyTransparent = false;
                    let anyCollapsed = false;

                    const processedNodes = flowData.nodes.map((n: any) => {
                        if (n.type === 'group') {
                            hasGroups = true;
                            if (n.data.isTransparent) anyTransparent = true;
                            if (n.data.collapsed) anyCollapsed = true;

                            // CRITICAL: Capture original dimensions from import so we don't shrink later
                            const w = n.style?.width || n.width;
                            const h = n.style?.height || n.height;

                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    expandedWidth: n.data.expandedWidth || (w ? Number(w) : 400),
                                    expandedHeight: n.data.expandedHeight || (h ? Number(h) : 400)
                                }
                            };
                        }
                        return n;
                    });

                    // Detect Diagram Type from imported nodes to update Legend
                    const firstTypedNode = processedNodes.find((n: any) => n.data?.diagramType);
                    if (firstTypedNode) {
                        setCurrentDiagramType(firstTypedNode.data.diagramType);
                    } else if (flowData.title) {
                        // Fallback simple detection from title if needed, otherwise keep default
                        // This prevents resetting to Data Engineering if the user imports a legacy file
                    }

                    setNodes(processedNodes);
                    setEdges(flowData.edges);

                    if (flowData.viewport && rfInstance) {
                        rfInstance.setViewport(flowData.viewport);
                    }

                    // Sync UI Toggles
                    if (hasGroups) {
                        setAreGroupsTransparent(anyTransparent);
                        setAreGroupsExpanded(!anyCollapsed);
                    } else {
                        setAreGroupsTransparent(false);
                        setAreGroupsExpanded(true);
                    }

                    addToast("Import", "Diagram imported successfully.", "success");
                } else {
                    addToast("Error", "Invalid JSON format.", "error");
                }
            } catch (err) {
                console.error(err);
                addToast("Error", "Failed to parse JSON file.", "error");
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }, [nodes, edges, takeSnapshot, setNodes, setEdges, rfInstance, addToast]);

    const onConnect = useCallback((params: Connection) => {
        takeSnapshot(nodes, edges);
        const palette = getThemePalette(currentDiagramType);
        const color = palette[Math.floor(Math.random() * palette.length)];

        setEdges((eds) => addEdge({
            ...params,
            type: 'custom',
            animated: globalAnimated,
            data: { color, diagramType: currentDiagramType, pathType: globalEdgeType },
            style: { stroke: color, strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: color, width: 12, height: 12 }
        }, eds));
        addToast("Connection", "Nodes linked.", "success");
    }, [nodes, edges, currentDiagramType, globalAnimated, globalEdgeType, takeSnapshot, addToast, setEdges]);

    // --- TOOLBAR ACTIONS ---

    const toggleEdgeAnimation = useCallback(() => {
        const newState = !globalAnimated;
        setGlobalAnimated(newState);
        setEdges((eds) => eds.map(e => ({
            ...e,
            animated: newState
        })));
        addToast("Animation", newState ? "Traffic Flow ON" : "Traffic Flow OFF", "info");
    }, [globalAnimated, setEdges, addToast]);

    const cycleEdgeType = useCallback(() => {
        // Added 'bezier' to the list
        const types = ['default', 'smoothstep', 'step', 'straight', 'bezier'];
        const currentIndex = types.indexOf(globalEdgeType);
        const nextType = types[(currentIndex + 1) % types.length];

        setGlobalEdgeType(nextType);
        setEdges((eds) => eds.map(e => ({
            ...e,
            data: { ...e.data, pathType: nextType }
        })));
        addToast("Edge Style", `Switched to ${nextType}`, "info");
    }, [globalEdgeType, setEdges, addToast]);

    const toggleAllGroups = useCallback(() => {
        const newState = !areGroupsExpanded; // True = Expanding, False = Collapsing (from UI perspective)
        setAreGroupsExpanded(newState);

        setNodes((nds) => {
            const groupIds = nds.filter(n => n.type === 'group').map(n => n.id);

            return nds.map(node => {
                // Handle Children visibility
                if (node.parentNode && groupIds.includes(node.parentNode)) {
                    return { ...node, hidden: !newState };
                }

                // Handle Group Nodes
                if (node.type === 'group') {
                    const currentStyle = node.style || {};
                    let expandedW = node.data.expandedWidth;
                    let expandedH = node.data.expandedHeight;

                    // If we are about to COLLAPSE (newState = false), save current dimensions
                    // Only save if we are currently expanded (not collapsed)
                    if (!newState && !node.data.collapsed) {
                        const w = currentStyle.width || node.width;
                        const h = currentStyle.height || node.height;
                        // Validation to prevent saving 0 or small values
                        if (w && Number(w) > 200) expandedW = Number(w);
                        if (h && Number(h) > 100) expandedH = Number(h);
                    }

                    // Fallbacks for restoration
                    const finalW = expandedW || 400;
                    const finalH = expandedH || 400;

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            collapsed: !newState,
                            expandedWidth: finalW,
                            expandedHeight: finalH
                        },
                        // If newState is TRUE (Expand), restore dimensions. If FALSE (Collapse), shrink.
                        style: !newState
                            ? { ...currentStyle, width: 200, height: 60 }
                            : { ...currentStyle, width: finalW, height: finalH }
                    };
                }
                return node;
            });
        });

        setTimeout(() => handleFitView(), 300); // Re-fit after size changes
        addToast("Groups", newState ? "All Groups Expanded" : "All Groups Collapsed", "info");
    }, [areGroupsExpanded, setNodes, handleFitView, addToast]);

    const toggleGroupTransparency = useCallback(() => {
        const newState = !areGroupsTransparent;
        setAreGroupsTransparent(newState);

        setNodes((nds) => nds.map(n => {
            if (n.type === 'group') {
                return { ...n, data: { ...n.data, isTransparent: newState } };
            }
            return n;
        }));
        addToast("Clean View", newState ? "Group Borders Hidden" : "Group Borders Visible", "info");
    }, [areGroupsTransparent, setNodes, addToast]);

    const onToggleLayout = useCallback(() => {
        takeSnapshot(nodes, edges);
        const newDirection = layoutDirection === 'LR' ? 'TB' : 'LR';
        setLayoutDirection(newDirection);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, newDirection, false);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setTimeout(() => handleFitView(), 200);
        addToast("Layout", `Direction: ${newDirection === 'LR' ? 'Horizontal' : 'Vertical'}`, "info");
    }, [nodes, edges, layoutDirection, takeSnapshot, setNodes, setEdges, handleFitView, addToast]);

    const onForceLayout = useCallback(() => {
        takeSnapshot(nodes, edges);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, layoutDirection, false);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setTimeout(() => handleFitView(), 200);
        addToast("Layout", "Graph Layout Re-calculated.", "info");
    }, [nodes, edges, layoutDirection, takeSnapshot, setNodes, setEdges, handleFitView, addToast]);

    const handleReset = useCallback(() => {
        takeSnapshot(nodes, edges);
        setNodes(initialNodes);
        setEdges(initialEdges);
        setSelectedNode(null);
        localStorage.removeItem(STORAGE_KEY); // Clear storage on reset
        addToast("Reset", "Canvas and storage cleared.", "info");
    }, [initialNodes, initialEdges, takeSnapshot, setNodes, setEdges, addToast]);

    const handleUpdateNode = useCallback((id: string, data: Partial<NodeData>) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
        setSelectedNode((prev) => prev && prev.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev);
    }, [setNodes]);

    const handleDeleteNode = useCallback((id: string) => {
        takeSnapshot(nodes, edges);
        setNodes((nds) => nds.filter(n => n.id !== id && n.parentNode !== id));
        setEdges((eds) => eds.filter(e => e.source !== id && e.target !== id));
        setSelectedNode(null);
        addToast("Deleted", "Node removed.", "info");
    }, [nodes, edges, takeSnapshot, setNodes, setEdges, addToast]);

    const handleAddNode = useCallback(() => {
        takeSnapshot(nodes, edges);

        // Find a safe position in the center
        let newX = 200;
        let newY = 200;
        if (rfInstance) {
            const viewport = rfInstance.getViewport();
            // Center of screen relative to viewport
            newX = (-viewport.x + (window.innerWidth / 2)) / viewport.zoom;
            newY = (-viewport.y + (window.innerHeight / 2)) / viewport.zoom;
        }

        const newNode: Node = {
            id: `node-${crypto.randomUUID()}`,
            type: 'custom',
            position: { x: newX, y: newY },
            data: {
                label: 'New Component',
                variant: 'service',
                technology: '',
                diagramType: currentDiagramType
            }
        };

        setNodes((nds) => [...nds, newNode]);
        addToast("Added", "New component added.", "success");
        setTimeout(() => focusOnNode(newNode.id), 100);
    }, [nodes, edges, takeSnapshot, setNodes, currentDiagramType, rfInstance, addToast]);

    const handleAddGroup = useCallback(() => {
        takeSnapshot(nodes, edges);

        // Find a safe position in the center
        let newX = 200;
        let newY = 200;
        if (rfInstance) {
            const viewport = rfInstance.getViewport();
            newX = (-viewport.x + (window.innerWidth / 2)) / viewport.zoom - 200; // Offset by half width
            newY = (-viewport.y + (window.innerHeight / 2)) / viewport.zoom - 200; // Offset by half height
        }

        const newGroup: Node = {
            id: `group-${crypto.randomUUID()}`,
            type: 'group',
            position: { x: newX, y: newY },
            style: { width: 400, height: 400 },
            data: {
                label: 'New Group',
                isTransparent: areGroupsTransparent,
                collapsed: !areGroupsExpanded,
                expandedWidth: 400,
                expandedHeight: 400
            }
        };

        setNodes((nds) => [...nds, newGroup]);
        addToast("Added", "New group added.", "success");
        setTimeout(() => focusOnNode(newGroup.id), 100);
    }, [nodes, edges, takeSnapshot, setNodes, rfInstance, addToast, areGroupsTransparent, areGroupsExpanded]);

    const handleAddTextNode = useCallback(() => {
        takeSnapshot(nodes, edges);

        let newX = 200;
        let newY = 200;
        if (rfInstance) {
            const viewport = rfInstance.getViewport();
            newX = (-viewport.x + (window.innerWidth / 2)) / viewport.zoom;
            newY = (-viewport.y + (window.innerHeight / 2)) / viewport.zoom;
        }

        const newText: Node = {
            id: `text-${crypto.randomUUID()}`,
            type: 'title', // Uses the existing 'title' node type for generic text
            position: { x: newX, y: newY },
            data: {
                label: 'New Text Note',
            }
        };

        setNodes((nds) => [...nds, newText]);
        addToast("Added", "Text note added.", "success");
        setTimeout(() => focusOnNode(newText.id), 100);
    }, [nodes, edges, takeSnapshot, setNodes, rfInstance, addToast]);

    const focusOnNode = useCallback((nodeId: string) => {
        if (!rfInstance) return;
        const target = nodes.find(n => n.id === nodeId);
        if (target) {
            const x = target.position.x + (THEME.dimensions.nodeWidth / 2);
            const y = target.position.y + (THEME.dimensions.nodeHeight / 2);
            let absX = x, absY = y;
            if (target.parentNode) {
                const p = nodes.find(n => n.id === target.parentNode);
                if (p) { absX += p.position.x; absY += p.position.y; }
            }
            rfInstance.setCenter(absX, absY, { zoom: 1.5, duration: 800 });
            setSelectedNode(target as Node<NodeData>);
        }
    }, [rfInstance, nodes]);

    return {
        nodes, setNodes, onNodesChange, onNodeDragStart, onNodeDragStop,
        edges, setEdges, onEdgesChange,
        selectedNode, setSelectedNode,
        layoutDirection, setLayoutDirection,
        currentDiagramType, setCurrentDiagramType,
        rfInstance, setRfInstance,

        // Expose State
        globalAnimated,
        areGroupsExpanded,
        areGroupsTransparent,

        // Expose Actions
        onConnect,
        onToggleLayout,
        onForceLayout,
        handleReset,
        handleFitView,
        handleImport,
        handleUpdateNode,
        handleDeleteNode,
        handleAddNode,
        handleAddGroup,
        handleAddTextNode,
        focusOnNode,

        // New Toolbar Actions
        toggleEdgeAnimation,
        cycleEdgeType,
        toggleAllGroups,
        toggleGroupTransparency
    };
};
