
import React from 'react';

const StaticBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0f172a]">
      {/* 1. Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
            backgroundImage: `
                linear-gradient(to right, #64748b 1px, transparent 1px),
                linear-gradient(to bottom, #64748b 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
        }}
      />

      {/* 2. Secondary Dotted Grid (Finer detail) */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '10px 10px'
        }}
      />

      {/* 3. Static Ambient Glow (Simulates the 3D fog without WebGL) */}
      <div 
        className="absolute inset-0"
        style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0) 60%)'
        }}
      />
      
      {/* 4. Top Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-transparent to-[#0f172a] opacity-60" />
    </div>
  );
};

export default StaticBackground;
