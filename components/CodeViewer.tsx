

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Download, BookOpen } from 'lucide-react';

interface CodeViewerProps {
    code: string;
    language: string;
    title?: string;
    onClose: () => void;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, language, title = "architecture", onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        // Create a blob with the Markdown content
        const blob = new Blob([code], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        // Sanitize filename
        const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        const filename = `${safeName}_infra.md`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#1e1e1e] border border-slate-700 rounded-xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            {language === 'terraform' ? <Terminal className="w-5 h-5 text-purple-400" /> : <FileCode className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Technical Documentation</h3>
                            <p className="text-xs text-slate-400">Implementation Guide & {language.charAt(0).toUpperCase() + language.slice(1)} Code</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 hover:text-white border border-indigo-500/30 transition-all"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download .MD
                        </button>
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy Raw"}
                        </button>
                        <button onClick={onClose} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-md transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-auto bg-[#1e1e1e] p-6 relative">
                    <div className="prose prose-invert prose-sm max-w-none">
                        {/* We render the text inside a pre-wrap div to respect formatting, 
                            but apply prose classes to style headers/code blocks if we were parsing MD. 
                            Since we are outputting raw text, we use whitespace-pre-wrap. 
                        */}
                        <div className="whitespace-pre-wrap font-mono text-slate-300 text-sm leading-relaxed">
                            {code}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeViewer;
