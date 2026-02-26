
import React, { useMemo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';
import { THEME } from '../theme';
import { DiagramType } from '../types';

// Helper to generate random traffic pattern (Laser Stream style)
const useTrafficPattern = (seed: string) => {
  return useMemo(() => {
    // Generate 4 distinct particles with different speeds/delays for high density
    return [1, 2, 3, 4].map((i) => ({
      id: i,
      speed: 1.0 + Math.random() * 1.5, // Faster speed between 1.0s and 2.5s
      delay: Math.random() * -3,      // Negative delay to start mid-path
      size: 2.5 + Math.random() * 2,    // Random size
      colorOffset: Math.random() > 0.4 ? '#fff' : 'currentColor'
    }));
  }, [seed]);
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  label,
  animated
}: EdgeProps) => {
  // Is Sketch Mode?
  const isSketch = data?.isSketchMode;

  // Diff Status
  const diffStatus = data?.diffStatus;
  const isAdded = diffStatus === 'added';
  const isRemoved = diffStatus === 'removed';

  // --- SEQUENCE DIAGRAM LOGIC (Preserved straight lines) ---
  if (data?.order !== undefined) {
    const stepHeight = THEME.dimensions.sequenceStepHeight;
    const finalY = sourceY + (data.order * stepHeight) + 40;
    const baseX = sourceX;
    const targetBaseX = targetX;

    const path = `M ${baseX} ${finalY} L ${targetBaseX} ${finalY}`;
    const isReturn = data.messageType === 'return';
    const strokeColor = isReturn ? '#94a3b8' : '#cbd5e1';
    const strokeStyle = isReturn ? '6, 4' : '0';
    const centerX = (baseX + targetBaseX) / 2;

    let displayLabel = label || '';
    let isAlt = false; let isLoop = false; let isOpt = false; let isNote = false; let groupTitle = '';

    if (typeof displayLabel === 'string') {
      const lower = displayLabel.toLowerCase();
      if (lower.startsWith('alt:') || displayLabel.startsWith('[alt]')) { isAlt = true; groupTitle = displayLabel.replace(/^alt:|\[alt\]/i, '').trim(); displayLabel = groupTitle; }
      else if (lower.startsWith('loop:') || displayLabel.startsWith('[loop]')) { isLoop = true; groupTitle = displayLabel.replace(/^loop:|\[loop\]/i, '').trim(); displayLabel = groupTitle; }
      else if (lower.startsWith('opt:') || displayLabel.startsWith('[opt]')) { isOpt = true; groupTitle = displayLabel.replace(/^opt:|\[opt\]/i, '').trim(); displayLabel = groupTitle; }
      else if (lower.startsWith('note:') || displayLabel.startsWith('Note:')) { isNote = true; displayLabel = displayLabel.replace(/^note:/i, '').trim(); }
    }

    if (isNote) {
      return (
        <>
          <BaseEdge path={`M ${baseX} ${finalY} L ${baseX + 40} ${finalY - 20}`} style={{ stroke: '#64748b', strokeDasharray: '2,2', opacity: 0.5 }} />
          <EdgeLabelRenderer>
            <div className="nodrag nopan" style={{ position: 'absolute', transform: `translate(0%, -50%) translate(${baseX + 10}px, ${finalY - 20}px)`, fontSize: 10, color: '#1e293b', backgroundColor: '#fef08a', padding: '6px 8px', borderRadius: 2, pointerEvents: 'all', zIndex: 1010, fontFamily: 'Inter, sans-serif', boxShadow: '2px 3px 5px rgba(0,0,0,0.1)', borderLeft: '3px solid #eab308', maxWidth: 160 }}>
              <span className="font-bold block text-[9px] uppercase opacity-70 mb-0.5">Note</span>{displayLabel}
            </div>
          </EdgeLabelRenderer>
        </>
      );
    }

    const isGroupStart = isAlt || isLoop || isOpt;
    return (
      <>
        {isGroupStart && (
          <EdgeLabelRenderer>
            <div className="nodrag nopan absolute" style={{ transform: `translate(-50%, -50%) translate(${centerX}px, ${finalY - 25}px)`, width: '200vw', height: 1, background: 'none', borderTop: '1px dashed #64748b', zIndex: 0, pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
              <div className="bg-slate-800 text-slate-400 px-2 text-[10px] font-mono -mt-2.5 uppercase tracking-widest" style={{ border: '1px dashed #64748b', borderRadius: 4 }}>
                {isOpt ? 'OPT' : isLoop ? 'LOOP' : 'ALT'}: {groupTitle}
              </div>
            </div>
          </EdgeLabelRenderer>
        )}
        <BaseEdge path={path} markerEnd={markerEnd} style={{ ...style, stroke: strokeColor, strokeDasharray: strokeStyle, strokeWidth: 2, filter: isSketch ? 'url(#sketch-filter)' : 'none' }} />
        {displayLabel && (
          <EdgeLabelRenderer>
            <div className="nodrag nopan flex flex-col items-center" style={{ position: 'absolute', transform: `translate(-50%, -100%) translate(${centerX}px, ${finalY - 4}px)`, zIndex: 1005, pointerEvents: 'all' }}>
              <div style={{ fontSize: 10, color: isReturn ? '#94a3b8' : '#e2e8f0', backgroundColor: '#1e1e24', padding: '2px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', border: `1px solid ${isReturn ? '#334155' : '#475569'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="opacity-40 text-[9px] font-bold tabular-nums border-r border-slate-600 pr-1.5">{data.order}</span><span>{displayLabel}</span>
              </div>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }

  // --- STANDARD LOGIC (Architecture / ERD) ---
  const edgeColor = data?.color || '#64748b';
  const isBackend = data?.diagramType === DiagramType.BACKEND_DESIGN;
  const isDataEng = data?.diagramType === DiagramType.DATA_ENGINEERING;

  // Initialize particles if animated
  const particles = useTrafficPattern(id);

  // Path Calculation
  let edgePath = '';
  let labelX = 0;
  let labelY = 0;

  let pathType = data?.pathType || 'default';

  if (isBackend) {
    pathType = 'smoothstep';
  }

  if (pathType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: isBackend ? 10 : 20
    });
  } else if (pathType === 'step') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 0
    });
  } else if (pathType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX, sourceY, targetX, targetY
    });
  } else if (pathType === 'bezier') {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.4
    });
  } else {
    if (isDataEng) {
      [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 20
      });
    } else {
      [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.4
      });
    }
  }

  // Visual Style Logic
  // Sketch Mode & Diff Mode Overrides
  let strokeColor = isSketch ? '#1e293b' : (isBackend ? '#94a3b8' : edgeColor);
  if (isAdded) strokeColor = '#10b981'; // Green
  if (isRemoved) strokeColor = '#ef4444'; // Red

  const strokeWidth = isSketch ? 2 : (isBackend ? 1.5 : 2.5);

  const labelBg = isSketch ? '#ffffff' : (isBackend ? '#0f172a' : '#1e293b');
  const labelColor = isSketch ? '#1e293b' : (isBackend ? '#cbd5e1' : edgeColor);
  const labelBorder = isSketch ? '#1e293b' : (isBackend ? `${edgeColor}40` : `${edgeColor}`);
  const labelShadow = isSketch ? '2px 2px 0px 0px rgba(0,0,0,0.1)' : (isBackend ? `0 2px 8px rgba(0,0,0,0.4)` : `0 0 10px ${edgeColor}40`);

  // INCREASED OPACITY FOR VISIBILITY
  const railOpacity = isRemoved ? 0.3 : (animated && !isSketch) ? 0.25 : 1;

  // Apply roughness filter if in sketch mode
  const edgeFilter = isSketch ? 'url(#sketch-filter)' : ((isBackend || isSketch) ? 'none' : `drop-shadow(0 0 4px ${edgeColor}60)`);

  return (
    <>
      {/* Background Solid Path (The "Fiber Tube") */}
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLinecap: isSketch ? 'round' : 'butt',
          strokeOpacity: railOpacity,
          animation: 'none',
          filter: edgeFilter
        }}
      />

      {/* The Laser Stream (Fast Dashed Line under particles) */}
      {animated && !isSketch && !isRemoved && (
        <BaseEdge
          path={edgePath}
          style={{
            ...style,
            stroke: '#ffffff',
            strokeWidth: strokeWidth * 0.5,
            opacity: 0.6,
            filter: `drop-shadow(0 0 6px ${strokeColor}) drop-shadow(0 0 12px ${strokeColor})`,
            strokeLinecap: 'round',
            strokeDasharray: '10, 10',
            animation: 'flowAnimation 1s linear infinite'
          }}
        />
      )}

      {/* --- TRAFFIC ANIMATION (Bright Glow Particles) --- */}
      {animated && !isSketch && !isRemoved && particles.map((p) => (
        <circle
          key={p.id}
          r={p.size}
          fill={p.colorOffset === '#fff' ? '#ffffff' : strokeColor}
          filter={`drop-shadow(0 0 5px ${strokeColor}) drop-shadow(0 0 10px #ffffff)`} // Intense glow
        >
          <animateMotion
            dur={`${p.speed}s`}
            repeatCount="indefinite"
            path={edgePath}
            begin={`${p.delay}s`}
            rotate="auto"
          />
        </circle>
      ))}

      {label && (
        <EdgeLabelRenderer>
          <div
            className="edge-label-container nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              fontSize: isSketch ? 12 : 10,
              color: labelColor,
              backgroundColor: labelBg,
              padding: '3px 8px',
              borderRadius: isSketch ? 2 : 12,
              border: `1px solid ${labelBorder}`,
              pointerEvents: 'all',
              zIndex: 1005,
              boxShadow: labelShadow,
              fontFamily: isSketch ? '"Patrick Hand", cursive' : 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
              fontWeight: (isBackend || isSketch) ? 600 : 600,
              opacity: isRemoved ? 0.5 : 1
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
