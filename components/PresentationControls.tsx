
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, GitMerge, Layers, ArrowRight, ChevronUp, Check } from 'lucide-react';
import { PresentationStrategy } from '../hooks/usePresentation';

interface PresentationControlsProps {
    currentStep: number;
    totalSteps: number;
    isPlaying: boolean;
    strategy: PresentationStrategy;
    onNext: () => void;
    onPrev: () => void;
    onTogglePlay: () => void;
    onExit: () => void;
    onChangeStrategy: (s: PresentationStrategy) => void;
}

const STRATEGY_OPTIONS: { value: PresentationStrategy; label: string; icon: React.ElementType }[] = [
    { value: 'dfs', label: 'Smart Flow (DFS)', icon: GitMerge },
    { value: 'bfs', label: 'By Layers (BFS)', icon: Layers },
    { value: 'coordinate', label: 'Visual (L → R)', icon: ArrowRight },
];

const PresentationControls: React.FC<PresentationControlsProps> = ({
    currentStep,
    totalSteps,
    isPlaying,
    strategy,
    onNext,
    onPrev,
    onTogglePlay,
    onExit,
    onChangeStrategy
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ left: 0, bottom: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const currentOption = STRATEGY_OPTIONS.find(o => o.value === strategy) || STRATEGY_OPTIONS[0];
    const StrategyIcon = currentOption.icon;

    // Close menu on window resize to avoid visual detachment
    useEffect(() => {
        const handleResize = () => setIsOpen(false);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate position relative to the viewport
            setMenuPos({
                left: rect.left,
                bottom: window.innerHeight - rect.top + 12 // 12px gap above the button
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Backdrop to close menu when clicking outside */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[4999]" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 
                FLOATING MENU 
                Rendered with fixed position to escape any parent overflow/clipping issues.
            */}
            {isOpen && (
                <div 
                    className="fixed z-[5001] w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-left"
                    style={{ 
                        left: menuPos.left, 
                        bottom: menuPos.bottom 
                    }}
                >
                    <div className="px-3 py-2 bg-slate-800/50 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
                        Traversal Logic
                    </div>
                    {STRATEGY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChangeStrategy(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-colors text-left hover:bg-slate-800 ${
                                strategy === opt.value ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'
                            }`}
                        >
                            <opt.icon className="w-4 h-4 opacity-70" />
                            <span className="flex-1">{opt.label}</span>
                            {strategy === opt.value && <Check className="w-3 h-3" />}
                        </button>
                    ))}
                </div>
            )}

            {/* MAIN TOOLBAR */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[5000] flex items-center gap-4 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-full shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                
                {/* Strategy Selector Button */}
                <div className="relative border-r border-slate-700 pr-3 mr-1">
                    <button 
                        ref={buttonRef}
                        onClick={handleToggle}
                        className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 uppercase tracking-wider outline-none cursor-pointer py-1 hover:text-white transition-colors min-w-[140px]"
                    >
                        <StrategyIcon className="w-3.5 h-3.5" />
                        <span>{currentOption.label}</span>
                        <ChevronUp className={`w-3 h-3 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Step Counter */}
                <div className="flex items-center gap-1 min-w-[60px] justify-center">
                    <span className="text-xs font-bold text-slate-200">
                        {currentStep + 1} <span className="text-slate-500 font-normal">/ {totalSteps}</span>
                    </span>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onPrev}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        title="Previous Step"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={onTogglePlay}
                        className={`p-2.5 rounded-full transition-all shadow-lg ${isPlaying ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                        title={isPlaying ? "Pause Auto-Play" : "Start Auto-Play"}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <button 
                        onClick={onNext}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        title="Next Step"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-px h-6 bg-slate-700 mx-1"></div>

                <button 
                    onClick={onExit}
                    className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
                    title="Exit Presentation"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </>
    );
};

export default PresentationControls;
