
import React, { useState, useMemo } from 'react';
import { List, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { Node } from 'reactflow';
import { getTechIcon } from './TechIcons';
import { THEME } from '../theme';
import { DiagramType } from '../types';

// --- LEGEND CONFIGURATION ---
const LEGEND_CONFIG: Partial<Record<DiagramType, { label: string; color: string }[]>> = {
    [DiagramType.BACKEND_DESIGN]: [
        { label: 'Driving (Client)', color: THEME.colors.hexagonal.inbound },
        { label: 'Application Layer', color: THEME.colors.hexagonal.application },
        { label: 'Domain Core', color: THEME.colors.hexagonal.domain },
        { label: 'Port Interface', color: THEME.colors.hexagonal.port },
        { label: 'Driven Adapter', color: THEME.colors.hexagonal.adapter },
        { label: 'Infrastructure', color: THEME.colors.hexagonal.infrastructure },
    ],
    [DiagramType.DATA_ENGINEERING]: [
        { label: 'Ingestion / Source', color: THEME.colors.dataEngineering.ingestion },
        { label: 'Compute / Spark', color: THEME.colors.dataEngineering.compute },
        { label: 'Storage / Lake', color: THEME.colors.dataEngineering.storage },
        { label: 'Stream / Kafka', color: THEME.colors.dataEngineering.stream },
        { label: 'Orchestration', color: THEME.colors.dataEngineering.orchestration },
    ],
    [DiagramType.CLOUD_ARCH]: [
        { label: 'Compute', color: THEME.colors.cloud.compute },
        { label: 'Database', color: THEME.colors.cloud.database },
        { label: 'Network', color: THEME.colors.cloud.network },
        { label: 'Storage', color: THEME.colors.cloud.storage },
        { label: 'Security', color: THEME.colors.cloud.security },
    ],
    [DiagramType.SECURITY]: [
        { label: 'Policy / WAF', color: THEME.colors.security.policy },
        { label: 'Firewall', color: THEME.colors.security.firewall },
        { label: 'Asset / Resource', color: THEME.colors.security.asset },
        { label: 'User / Identity', color: THEME.colors.security.user },
    ],
    [DiagramType.AI_ML]: [
        { label: 'Model / AI', color: THEME.colors.ai.model },
        { label: 'Training Data', color: THEME.colors.ai.data },
        { label: 'Output / Dashboard', color: THEME.colors.ai.output },
        { label: 'Infrastructure', color: THEME.colors.ai.infrastructure },
    ],
    [DiagramType.DEVOPS]: [
        { label: 'CI/CD Pipeline', color: THEME.colors.cloud.compute },
        { label: 'Container Registry', color: THEME.colors.cloud.storage },
        { label: 'Kubernetes', color: THEME.colors.cloud.network },
    ],
    [DiagramType.SYSTEM_PIPELINES]: [
        { label: 'Processing Step', color: THEME.colors.dataEngineering.compute },
        { label: 'State Store', color: THEME.colors.dataEngineering.storage },
        { label: 'Queue', color: THEME.colors.dataEngineering.stream },
    ]
};

export const DiagramLegend = ({ currentType }: { currentType?: DiagramType }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const items = useMemo(() => {
        if (!currentType) return [];
        return LEGEND_CONFIG[currentType] || [];
    }, [currentType]);

    // If no config found for this type, or explicitly empty default, don't render
    if (items.length === 0) return null;

    // Positioned safely above MiniMap (bottom: 200px)
    return (
        <div className={`absolute bottom-[200px] right-4 z-[3000] flex flex-col items-end transition-all duration-300`}>
            {isCollapsed ? (
                <button 
                    onClick={() => setIsCollapsed(false)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl text-slate-400 hover:text-white hover:border-indigo-500 transition-all"
                    title="Show Legend"
                >
                    <List className="w-4 h-4" />
                    <span className="text-xs font-bold">Legend</span>
                </button>
            ) : (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-4 min-w-[180px]">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {currentType === DiagramType.BACKEND_DESIGN ? 'Layers' : 'Key'}
                        </h4>
                        <button onClick={() => setIsCollapsed(true)} className="text-slate-500 hover:text-white transition-colors" title="Minimize">
                            <Minus className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] text-slate-300 font-medium">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded shadow-sm" 
                                    style={{ 
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 8px ${item.color}66`
                                    }}
                                ></div>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const TechStackBar = ({ nodes }: { nodes: Node[] }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const techs = useMemo(() => {
        const tSet = new Set<string>();
        nodes.forEach(n => {
            if(n.data.technology) tSet.add(n.data.technology);
        });
        return Array.from(tSet).slice(0, 6); 
    }, [nodes]);

    if (techs.length === 0) return null;

    return (
        <div className="hidden sm:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-[3000] flex-col items-center pointer-events-none">
            {/* Toggle Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="pointer-events-auto mb-2 bg-slate-900 border border-slate-700 text-slate-400 p-1 rounded-full hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg"
                title={isCollapsed ? "Show Tech Stack" : "Hide Tech Stack"}
            >
                {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Bar Content */}
            <div className={`
                bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-t-lg px-3 py-1.5 flex items-center gap-3 shadow-xl pointer-events-auto transition-all duration-300 origin-bottom mb-0
                ${isCollapsed ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100 mb-6'}
            `}>
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-r border-slate-700 pr-3">Powered By</span>
                 <div className="flex gap-2">
                    {techs.map((t, i) => (
                        <span key={i} className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1.5">
                            {getTechIcon(t)}
                            <span>{t}</span>
                        </span>
                    ))}
                 </div>
            </div>
        </div>
    );
};
