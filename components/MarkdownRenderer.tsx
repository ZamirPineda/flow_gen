
import React from 'react';
import DOMPurify from 'dompurify';


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
                        <span className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseInlineToHTML(cleanLine)) }} />
                    </div>
                );
            }

            // Standard Paragraph
            return (
                <p key={`${index}-${lineIdx}`} className="text-slate-300 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseInlineToHTML(line)) }} />
            );
        });
      })}
    </div>
  );
};


// Helper to handle **Bold** and `Code` inline and output HTML string
const parseInlineToHTML = (text: string): string => {
    // Basic escaping to prevent raw HTML from being injected directly,
    // but since we are sanitizing afterwards, we mainly need to parse our markdown subset
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const parts = escaped.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return `<strong class="text-white font-semibold">${part.slice(2, -2)}</strong>`;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return `<code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono text-xs border border-slate-700">${part.slice(1, -1)}</code>`;
        }
        return part;
    }).join('');
};

export default MarkdownRenderer;
