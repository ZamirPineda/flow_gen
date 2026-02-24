
import React from 'react';
import { Loader2, BrainCircuit, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "AI is thinking..." }) => {
  return (
    // Fixed position moved to left-96 (approx 384px) to avoid center overlap.
    // Sidebar is w-80 (320px), so this sits nicely to the right of the sidebar.
    <div className="fixed bottom-10 left-96 z-[5000] pointer-events-none flex flex-col items-start gap-2 animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* The Status Pill - pointer-events-auto allows interaction with the pill itself if needed */}
      <div className="flex items-center gap-4 pl-4 pr-6 py-3 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.25)] pointer-events-auto ring-1 ring-white/10">
        
        {/* Animated Icon Group */}
        <div className="relative">
            {/* Spinning Ring */}
            <div className="absolute inset-[-4px] border-2 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin"></div>
            
            {/* Core Icon */}
            <div className="relative w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>

            {/* Sparkle Accent */}
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-bounce" />
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-0.5">FlowGen AI</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200 min-w-[120px]">{message}</span>
                {/* Typing dots simulation */}
                <div className="flex gap-0.5 mt-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
