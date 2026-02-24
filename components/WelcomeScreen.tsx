
import React from 'react';
import { Database, Cloud, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';
import { DiagramType } from '../types';

interface WelcomeScreenProps {
    onQuickStart: (prompt: string, type: DiagramType) => void;
}

const TEMPLATES = [
    {
        title: "Data Platform",
        desc: "Empty workspace for data platforms.",
        icon: Database,
        type: DiagramType.DATA_ENGINEERING,
        prompt: ""
    },
    {
        title: "Cloud Infrastructure",
        desc: "Empty workspace for cloud architectures.",
        icon: Cloud,
        type: DiagramType.CLOUD_ARCH,
        prompt: ""
    },
    {
        title: "UML / Design",
        desc: "Empty workspace for system modeling.",
        icon: BrainCircuit,
        type: DiagramType.UML,
        prompt: ""
    }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickStart }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
            <div className="max-w-2xl w-full p-8 flex flex-col items-center pointer-events-auto animate-in fade-in zoom-in-95 duration-500">

                {/* Hero Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-4 drop-shadow-xl">
                    FlowGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Architect</span>
                </h1>

                <p className="text-slate-400 text-center text-lg max-w-lg mb-10 leading-relaxed">
                    Start drafting your system manually. Select a blank workspace to begin.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    {TEMPLATES.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => onQuickStart(t.prompt, t.type)}
                            className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-700 hover:border-indigo-500/50 p-5 rounded-2xl text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-slate-800/80"
                        >
                            <div className="mb-3 p-2.5 bg-slate-800 rounded-lg inline-flex group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors text-slate-400">
                                <t.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-slate-200 font-bold text-sm mb-1">{t.title}</h3>
                            <p className="text-slate-500 text-xs leading-snug">{t.desc}</p>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                                <ArrowRight className="w-4 h-4 text-indigo-400" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
