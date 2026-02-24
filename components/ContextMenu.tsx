

import React from 'react';
import { Sparkles, HelpCircle, Layers, ShieldCheck, Database, RefreshCw, DollarSign, ZoomIn } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    nodeLabel: string;
    onClose: () => void;
    onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeLabel, onClose, onAction }) => {
    // Prevent menu from going off-screen (basic check)
    const style = {
        top: y,
        left: x,
    };

    const menuItems = [
        { id: 'drill_down', label: 'Drill Down / Internals', icon: ZoomIn, color: 'text-white' }, // New Action
    ];

    return (
        <div
            className="fixed z-[9999] w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={style}
            onMouseLeave={onClose}
        >
            <div className="px-3 py-2 border-b border-slate-700 bg-slate-800/50">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Actions for</h4>
                <p className="text-xs font-semibold text-slate-200 truncate">{nodeLabel}</p>
            </div>

            <div className="p-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            onAction(item.id);
                            onClose();
                        }}
                        className={`w-full text-left px-2 py-2 flex items-center gap-3 hover:bg-slate-800 rounded transition-colors group ${item.id === 'drill_down' ? 'bg-indigo-500/10 hover:bg-indigo-500/20' : ''}`}
                    >
                        <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className={`text-xs font-medium group-hover:text-white ${item.id === 'drill_down' ? 'text-indigo-300' : 'text-slate-300'}`}>
                            {item.label}
                        </span>
                        {item.id.includes('suggest') && (
                            <Sparkles className="w-3 h-3 text-indigo-500 ml-auto opacity-0 group-hover:opacity-100" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContextMenu;
