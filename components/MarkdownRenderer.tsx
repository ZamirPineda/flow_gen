
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-2 ${className}`}>
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.replace(/```/g, '');
          return (
            <div key={index} className="bg-slate-950 rounded-md p-3 border border-slate-800 my-2 overflow-x-auto">
              {lang && <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">{lang}</div>}
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{code}</pre>
            </div>
          );
        }

        // Process inline formatting for non-code blocks
        // We'll split by newlines to handle paragraphs and lists
        const lines = part.split('\n');
        
        return lines.map((line, lineIdx) => {
            if (!line.trim()) return <div key={`${index}-${lineIdx}`} className="h-2" />;

            // Headings
            if (line.startsWith('### ')) return <h4 key={`${index}-${lineIdx}`} className="text-sm font-bold text-indigo-300 mt-3 mb-1">{line.replace('### ', '')}</h4>;
            if (line.startsWith('## ')) return <h3 key={`${index}-${lineIdx}`} className="text-base font-bold text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
            
            // Bullet points
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const cleanLine = line.trim().substring(2);
                return (
                    <div key={`${index}-${lineIdx}`} className="flex gap-2 ml-2 mb-1">
                        <span className="text-indigo-400 mt-1.5">•</span>
                        <span className="text-slate-300 leading-relaxed">{parseInline(cleanLine)}</span>
                    </div>
                );
            }

            // Standard Paragraph
            return (
                <p key={`${index}-${lineIdx}`} className="text-slate-300 leading-relaxed mb-1">
                    {parseInline(line)}
                </p>
            );
        });
      })}
    </div>
  );
};

// Helper to handle **Bold** and `Code` inline
const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono text-xs border border-slate-700">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

export default MarkdownRenderer;
