
import React, { memo } from 'react';
import { IsometricDefs } from './IsometricIcons';

// This node is invisible but vital. 
// It injects the SVG <defs> (gradients) inside the React Flow viewport.
// This allows html-to-image to find the gradient references during export.
// We use opacity: 0 instead of visibility: hidden because html-to-image skips hidden elements.
const DefsNode = () => {
  return (
    <div style={{ width: 0, height: 0, opacity: 0, position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: -9999 }}>
      <svg width="0" height="0">
        <IsometricDefs />
        
        <defs>
            {/* 
                SKETCHY LINE FILTER 
                Creates a rough, hand-drawn wobbly effect on strokes using turbulence displacement.
            */}
            <filter id="sketch-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
      </svg>
    </div>
  );
};

export default memo(DefsNode);
