
import React from 'react';

// Common stroke properties for "sketch" feel
const strokeProps = {
    stroke: "#334155",
    strokeWidth: "2",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
    fill: "none"
};

const fillProps = {
    fill: "#f1f5f9",
    fillOpacity: 0.5
};

interface SketchProps {
    className?: string;
    size?: number;
}

export const SketchServer: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        {/* Box body */}
        <path d="M12 10 L52 10 L52 54 L12 54 Z" {...fillProps} {...strokeProps} />
        {/* Lines suggesting rack units */}
        <path d="M12 24 L52 24" {...strokeProps} />
        <path d="M12 40 L52 40" {...strokeProps} />
        {/* Lights */}
        <circle cx="18" cy="17" r="2" fill="#334155" />
        <circle cx="24" cy="17" r="2" fill="none" stroke="#334155" strokeWidth="1" />
        <circle cx="18" cy="32" r="2" fill="#334155" />
        <circle cx="18" cy="47" r="2" fill="#334155" />
    </svg>
);

export const SketchDB: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        {/* Cylinder body */}
        <path d="M12 16 V48 C12 56 52 56 52 48 V16" {...fillProps} {...strokeProps} />
        {/* Top ellipse */}
        <ellipse cx="32" cy="16" rx="20" ry="8" {...fillProps} {...strokeProps} />
        {/* Middle curve */}
        <path d="M12 32 C12 40 52 40 52 32" {...strokeProps} fill="none" />
    </svg>
);

export const SketchCloud: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <path d="M14 44 C6 44 4 32 12 28 C10 16 26 12 32 18 C38 8 56 14 54 26 C62 28 60 44 50 44 Z" {...fillProps} {...strokeProps} />
    </svg>
);

export const SketchUser: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <circle cx="32" cy="20" r="10" {...fillProps} {...strokeProps} />
        <path d="M12 54 C12 34 52 34 52 54" {...strokeProps} fill="none" />
    </svg>
);

export const SketchQueue: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        {/* Pipe / Queue */}
        <path d="M10 20 H54" {...strokeProps} />
        <path d="M10 44 H54" {...strokeProps} />
        <rect x="14" y="24" width="10" height="16" {...fillProps} {...strokeProps} />
        <rect x="28" y="24" width="10" height="16" {...fillProps} {...strokeProps} />
        <rect x="42" y="24" width="10" height="16" {...fillProps} {...strokeProps} />
    </svg>
);

export const SketchLaptop: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <rect x="10" y="14" width="44" height="28" rx="2" {...fillProps} {...strokeProps} />
        <path d="M4 50 L60 50 L56 42 H8 Z" {...fillProps} {...strokeProps} />
    </svg>
);

export const SketchFile: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <path d="M16 8 L40 8 L52 20 L52 56 L16 56 Z" {...fillProps} {...strokeProps} />
        <path d="M40 8 V20 H52" {...strokeProps} />
        <path d="M24 24 H40" {...strokeProps} />
        <path d="M24 32 H44" {...strokeProps} />
        <path d="M24 40 H44" {...strokeProps} />
        <path d="M24 48 H36" {...strokeProps} />
    </svg>
);

export const SketchAI: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <rect x="16" y="16" width="32" height="32" rx="4" {...fillProps} {...strokeProps} />
        {/* Legs */}
        <path d="M16 20 H8" {...strokeProps} />
        <path d="M16 28 H8" {...strokeProps} />
        <path d="M16 36 H8" {...strokeProps} />
        <path d="M16 44 H8" {...strokeProps} />
        
        <path d="M48 20 H56" {...strokeProps} />
        <path d="M48 28 H56" {...strokeProps} />
        <path d="M48 36 H56" {...strokeProps} />
        <path d="M48 44 H56" {...strokeProps} />
        
        <path d="M20 16 V8" {...strokeProps} />
        <path d="M28 16 V8" {...strokeProps} />
        <path d="M36 16 V8" {...strokeProps} />
        <path d="M44 16 V8" {...strokeProps} />
        
        <circle cx="32" cy="32" r="6" {...strokeProps} />
    </svg>
);

export const SketchLock: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <rect x="16" y="28" width="32" height="24" rx="2" {...fillProps} {...strokeProps} />
        <path d="M24 28 V18 A8 8 0 0 1 40 18 V28" {...strokeProps} />
        <circle cx="32" cy="40" r="2" fill="#334155" />
    </svg>
);

export const SketchGeneric: React.FC<SketchProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="overflow-visible">
        <rect x="12" y="16" width="40" height="32" {...fillProps} {...strokeProps} />
        <path d="M12 16 L22 8 L62 8 L52 16" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M62 8 L62 40 L52 48" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
