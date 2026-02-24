
import React, { memo } from 'react';
import { NodeProps, useReactFlow, Handle, Position } from 'reactflow';
import { DiagramType, NodeData } from '../types';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Layers } from 'lucide-react';
import { THEME } from '../theme';

const GroupNode = ({ id, data, selected }: NodeProps<NodeData>) => {
    const { getNodes, setNodes } = useReactFlow();

    // Detect Backend Design mode via data prop
    const isBackend = data.diagramType === DiagramType.BACKEND_DESIGN;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        const isCollapsed = data.collapsed;
        const nodes = getNodes();

        const childrenIds = nodes
            .filter(n => n.parentNode === id)
            .map(n => n.id);

        setNodes(nds => nds.map(node => {
            if (childrenIds.includes(node.id)) {
                return {
                    ...node,
                    hidden: !isCollapsed,
                };
            }

            if (node.id === id) {
                const currentStyle = node.style || {};

                if (!isCollapsed) {
                    // COLLAPSING
                    const measuredWidth = (node as any).measured?.width;
                    const measuredHeight = (node as any).measured?.height;

                    const widthToStore = measuredWidth || currentStyle.width || node.width || THEME.dimensions.nodeWidth * 2;
                    const heightToStore = measuredHeight || currentStyle.height || node.height || THEME.dimensions.nodeHeight * 2;

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            collapsed: true,
                            expandedWidth: Number(widthToStore),
                            expandedHeight: Number(heightToStore)
                        },
                        style: {
                            ...currentStyle,
                            width: isBackend ? 660 : 200,
                            height: 60
                        }
                    };
                } else {
                    // EXPANDING
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            collapsed: false
                        },
                        style: {
                            ...currentStyle,
                            width: node.data.expandedWidth || (isBackend ? 660 : THEME.dimensions.nodeWidth * 2),
                            height: node.data.expandedHeight || THEME.dimensions.nodeHeight * 2
                        }
                    };
                }
            }
            return node;
        }));
    };

    // --- BACKEND DESIGN SPECIFIC STYLING ---
    if (isBackend) {
        return (
            <div
                className={`
                relative w-full h-full rounded-lg transition-all duration-300 group
                ${selected ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-600/30 bg-slate-800/10'}
                ${data.isTransparent ? '!border-transparent !bg-transparent' : ''}
            `}
                style={{
                    borderWidth: 1,
                    borderStyle: 'dashed'
                }}
            >
                {/* Centered Label for Layers */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-900 border border-slate-700 rounded-full shadow-sm flex items-center gap-1.5 z-20 ${data.isTransparent ? 'opacity-0' : 'opacity-100'}`}>
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {data.label}
                    </span>
                </div>
            </div>
        );
    }

    // --- STANDARD GROUP STYLING ---

    const isCollapsed = data.collapsed;
    // CRITICAL FIX: Ensure a collapsed group is NEVER transparent, otherwise it becomes invisible.
    // Transparency (Clean View) should only apply to expanded containers.
    const isTransparent = data.isTransparent && !isCollapsed;

    // Base classes that always apply
    const baseClasses = "relative w-full h-full rounded-2xl border-2 transition-all duration-300 group";

    // Dynamic classes based on state
    let appearanceClasses = "";

    if (isTransparent) {
        // Force transparency
        appearanceClasses = "border-transparent bg-transparent shadow-none";
    } else {
        // Visible State
        if (selected) {
            appearanceClasses = "border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]";
        } else {
            appearanceClasses = "border-slate-700/50 bg-slate-900/20 hover:border-slate-600";
        }
    }

    return (
        <div
            className={`${baseClasses} ${appearanceClasses}`}
            style={{
                backdropFilter: isTransparent ? 'none' : 'blur(4px)',
                overflow: isCollapsed ? 'hidden' : 'visible'
            }}
        >
            <div className={`absolute -top-4 left-4 flex gap-2 z-20 transition-opacity duration-300 ${isTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center gap-2">
                    <button
                        onClick={handleToggle}
                        className="hover:text-white text-slate-400 transition-colors focus:outline-none"
                    >
                        {isCollapsed
                            ? <ChevronRight className="w-3 h-3" />
                            : <ChevronDown className="w-3 h-3" />
                        }
                    </button>

                    {isCollapsed
                        ? <Folder className="w-3 h-3 text-indigo-400" />
                        : <FolderOpen className="w-3 h-3 text-indigo-400" />
                    }

                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        {data.label}
                    </span>

                    {isCollapsed && (
                        <span className="ml-1 text-[9px] text-slate-500 bg-slate-900 px-1.5 rounded-sm">
                            ...
                        </span>
                    )}
                </div>
            </div>

            {/* Corner Accents - STRICTLY HIDDEN if Collapsed OR Transparent */}
            {!isCollapsed && !isTransparent && (
                <>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-600 rounded-tr-xl opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-600 rounded-bl-xl opacity-50 pointer-events-none"></div>
                </>
            )}

            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-800 hover:!bg-indigo-300 hover:!scale-150 transition-transform cursor-crosshair z-50"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-800 hover:!bg-emerald-300 hover:!scale-150 transition-transform cursor-crosshair z-50"
            />
        </div>
    );
};

export default memo(GroupNode);
