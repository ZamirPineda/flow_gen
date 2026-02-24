
import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';

// A specialized node just for the title. 
// Now includes NodeResizer so the user can control the box size and the extent of the glow.
const TitleNode = ({ data, selected }: NodeProps) => {
  return (
    <>
        <NodeResizer 
            color="#6366f1" 
            isVisible={selected} 
            minWidth={300} 
            minHeight={100}
            handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
        />
        
        {/* w-full h-full is critical here so it respects the 'width' set by the Resizer */}
        <div 
            className={`
                relative flex flex-col items-center justify-center p-4 w-full h-full transition-all duration-300 rounded-2xl
                ${selected ? 'bg-indigo-500/5 border border-indigo-500/30' : ''}
            `}
        >
            {/* Decorative Background Glow - Scales with the container */}
            <div 
                className="absolute inset-0 rounded-3xl bg-indigo-500/15 blur-3xl pointer-events-none transition-all duration-500"
                style={{ zIndex: -1 }}
            />
            
            {/* Title Text 
                NOTE: Removed 'bg-clip-text text-transparent' because html-to-image 
                often fails to render it in exports. Using standard text color with shadow instead.
            */}
            <h1 
                className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight leading-tight select-none pointer-events-none"
                style={{ 
                    fontFamily: 'Inter, sans-serif',
                    maxWidth: '90%', // Prevent text from hitting the very edge of the wide box
                    whiteSpace: 'pre-wrap',
                    textShadow: '0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)' // Simulated glow
                }}
            >
                {data.label}
            </h1>
            
            {/* Underline Decoration */}
            <div className="w-32 h-1.5 bg-indigo-500 mt-4 rounded-full opacity-80 shadow-[0_0_10px_rgba(99,102,241,0.8)] pointer-events-none" />
        </div>
    </>
  );
};

export default memo(TitleNode);
