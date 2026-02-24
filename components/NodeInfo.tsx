
import React from 'react';
import { X, Info } from 'lucide-react';
import { Node } from 'reactflow';
import { NodeData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface NodeInfoProps {
  node: Node<NodeData> | null;
  onClose: () => void;
}

const NodeInfo: React.FC<NodeInfoProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl rounded-xl overflow-hidden z-[3000] animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <h3 className="font-medium text-sm text-slate-200 truncate">{node.data.label}</h3>
        </div>
        <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-800 px-2 py-1 rounded">
                {node.data.type || 'Default'} Node
            </span>
        </div>
        <div className="text-sm text-slate-400 leading-relaxed">
            {node.data.details ? (
                <MarkdownRenderer content={node.data.details} />
            ) : (
                "No additional details provided for this component."
            )}
        </div>
        <div className="mt-4 text-xs text-slate-600 font-mono">
            ID: {node.id}
        </div>
      </div>
    </div>
  );
};

export default NodeInfo;
