
import React from 'react';
import { ChevronRight, Home, Layers } from 'lucide-react';
import { DiagramType } from '../types';

interface BreadcrumbNavProps {
    stack: { title: string; diagramType: DiagramType }[];
    onNavigate: (index: number) => void;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ stack, onNavigate }) => {
    return (
        <div className="absolute top-4 left-20 z-[4000] flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-2 py-1.5 shadow-xl">
                
                {/* Root Home Button */}
                <button 
                    onClick={() => onNavigate(-1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${stack.length === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Home className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">System</span>
                </button>

                {/* Stack Items */}
                {stack.map((item, index) => {
                    const isLast = index === stack.length - 1;
                    return (
                        <React.Fragment key={index}>
                            <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />
                            <button
                                onClick={() => !isLast && onNavigate(index)}
                                disabled={isLast}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                                    isLast 
                                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 cursor-default' 
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5 opacity-70" />
                                <span className="text-xs font-medium max-w-[150px] truncate">
                                    {item.title}
                                </span>
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default BreadcrumbNav;
