
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Eraser, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => Promise<void>;
    onClose: () => void;
    onResetHighlights: () => void;
    isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onClose, onResetHighlights, isProcessing }) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Auto-focus input on open
        if(inputRef.current) inputRef.current.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isProcessing) return;
        
        const text = inputValue;
        setInputValue('');
        await onSendMessage(text);
    };

    return (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] max-h-[70vh] bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl z-[4500] flex flex-col overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Conversational Canvas</h3>
                        <p className="text-[10px] text-slate-400">Ask questions or modify the graph</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={onResetHighlights} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-400 transition-colors" title="Clear Highlights">
                        <Eraser className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 opacity-50">
                        <Sparkles className="w-12 h-12 text-indigo-400 mb-3" />
                        <p className="text-sm text-slate-300 font-medium">How can I help you?</p>
                        <p className="text-xs text-slate-500 mt-2">Try asking: "Highlight the critical path", "Where are the SPOFs?", or "Add a cache to the API".</p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                            : 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-100 rounded-tl-none'
                        }`}>
                            {msg.role === 'user' ? (
                                msg.text
                            ) : (
                                <MarkdownRenderer content={msg.text} />
                            )}
                        </div>
                    </div>
                ))}

                {isProcessing && (
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                             <Loader2 className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                             <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                             <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                             <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        </div>
                     </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700 bg-slate-900">
                <div className="relative flex items-center">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Message FlowGen..."
                        disabled={isProcessing}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isProcessing}
                        className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
