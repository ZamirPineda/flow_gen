

import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeToolbar, useReactFlow } from 'reactflow';
import { DiagramType, NodeData } from '../types';
import { THEME } from '../theme';
import { 
    IsometricServer, IsometricDB, IsometricLaptop, IsometricCloud, 
    IsometricUser, IsometricLock, IsometricGeneric, IsometricAI, IsometricTable, IsometricFile,
    IsometricParquet, IsometricJSON, IsometricCSV, IsometricTXT,
    IsometricMobile, IsometricBrowser, IsometricIoT, IsometricRouter, IsometricLoadBalancer, IsometricDashboard, IsometricGateway, IsometricFirewall,
    IsometricRegistry, IsometricCDN, IsometricDNS, IsometricVPN, IsometricAlert, IsometricLog,
    IsometricCluster, IsometricJob, IsometricLake, IsometricWarehouse, IsometricStream, IsometricMachine, IsometricQueue
} from './IsometricIcons';
import {
    SketchServer, SketchDB, SketchCloud, SketchUser, SketchQueue, SketchLaptop, SketchFile, SketchAI, SketchLock, SketchGeneric
} from './SketchIcons';
import { getTechIcon } from './TechIcons';
import { Info, AlertTriangle, ShieldAlert, Edit2, PlusCircle, MinusCircle, RefreshCcw, DollarSign } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

// --- COLOR DETERMINATION LOGIC ---
const getNodeColor = (type: DiagramType | undefined, variant: string = 'default', label: string = ''): string => {
    const l = label.toLowerCase();
    
    // 1. BACKEND / HEXAGONAL DESIGN (Strict Rules)
    if (type === DiagramType.BACKEND_DESIGN) {
        if (variant === 'client') return THEME.colors.hexagonal.inbound; // Driving (Green)
        if (variant === 'service' || variant === 'function' || variant === 'container') return THEME.colors.hexagonal.application; // App (Blue)
        if (variant === 'ai') return THEME.colors.hexagonal.domain; // Domain (Purple)
        if (variant === 'table' || variant === 'api') return THEME.colors.hexagonal.port; // Port (Yellow)
        if (variant === 'queue') return THEME.colors.hexagonal.adapter; // Driven (Orange)
        if (variant === 'database' || variant === 'cloud') return THEME.colors.hexagonal.infrastructure; // Infra (Dark Blue)
        
        // Fallback heuristics
        if (l.includes('adapter')) return THEME.colors.hexagonal.adapter;
        if (l.includes('port') || l.includes('interface')) return THEME.colors.hexagonal.port;
        if (l.includes('domain') || l.includes('entity')) return THEME.colors.hexagonal.domain;
        
        return THEME.colors.hexagonal.external;
    }

    // 2. DATA ENGINEERING (Neon/Dark Vibes)
    if (type === DiagramType.DATA_ENGINEERING || type === DiagramType.SYSTEM_PIPELINES) {
        if (variant === 'service' || variant === 'function') return THEME.colors.dataEngineering.compute; // Spark Orange
        if (variant === 'database' || variant === 'file') return THEME.colors.dataEngineering.storage; // Cyan
        if (variant === 'queue') return THEME.colors.dataEngineering.stream; // Pink
        if (variant === 'client' || variant === 'dashboard') return THEME.colors.dataEngineering.ingestion;
        // Big Data additions
        if (variant === 'lake') return THEME.colors.bigData.lake;
        if (variant === 'warehouse') return THEME.colors.bigData.warehouse;
        if (variant === 'job') return THEME.colors.bigData.job;
        if (variant === 'cluster') return THEME.colors.bigData.cluster;
        if (variant === 'stream') return THEME.colors.bigData.stream;
        
        return THEME.colors.dataEngineering.default;
    }

    // 3. CLOUD ARCHITECTURE (Blue/Indigo/Purple)
    if (type === DiagramType.CLOUD_ARCH || type === DiagramType.DEVOPS) {
        if (variant === 'service' || variant === 'container') return THEME.colors.cloud.compute;
        if (variant === 'function') return '#fbbf24'; // Serverless Yellow/Amber
        if (variant === 'api' || variant === 'gateway') return '#ec4899'; // API Pink
        if (variant === 'database') return THEME.colors.cloud.database;
        if (variant === 'cloud') return THEME.colors.cloud.network;
        if (variant === 'security' || variant === 'firewall') return THEME.colors.cloud.security;
        if (variant === 'load_balancer') return THEME.colors.cloud.network;
        if (variant === 'router') return THEME.colors.cloud.network;
        
        // DevOps additions
        if (variant === 'registry') return THEME.colors.cloud.storage;
        if (variant === 'cdn') return '#38bdf8';
        if (variant === 'dns') return '#f59e0b';
        
        return THEME.colors.cloud.default;
    }

    // 4. SECURITY (Red/Amber)
    if (type === DiagramType.SECURITY) {
        if (variant === 'service') return THEME.colors.security.firewall;
        if (variant === 'security' || variant === 'firewall') return THEME.colors.security.policy;
        if (variant === 'client' || variant === 'mobile' || variant === 'browser') return THEME.colors.security.user;
        if (variant === 'vpn') return '#6366f1';
        if (variant === 'alert') return '#ef4444';
        return THEME.colors.security.asset;
    }

    // 5. AI / ML (Purple/Teal)
    if (type === DiagramType.AI_ML) {
        if (variant === 'ai' || variant === 'service') return THEME.colors.ai.model;
        if (variant === 'database' || variant === 'file') return THEME.colors.ai.data;
        if (variant === 'dashboard') return THEME.colors.ai.output;
        if (variant === 'machine') return THEME.colors.bigData.machine;
        return THEME.colors.ai.infrastructure;
    }

    // 6. DEFAULT / STANDARD FALLBACK
    switch (variant) {
        case 'client': return THEME.colors.standard.client;
        case 'service': return THEME.colors.standard.service;
        case 'container': return THEME.colors.standard.service;
        case 'function': return '#fbbf24'; // Serverless Yellow
        case 'api': return '#d946ef'; // API Magenta
        case 'database': return THEME.colors.standard.database;
        case 'queue': return THEME.colors.standard.queue;
        case 'cloud': return THEME.colors.standard.cloud;
        case 'security': return THEME.colors.standard.security;
        case 'ai': return THEME.colors.standard.ai;
        case 'file': return THEME.colors.standard.file;
        case 'table': return THEME.colors.standard.table;
        
        // NEW VARIANTS
        case 'mobile': return THEME.colors.network.mobile;
        case 'browser': return THEME.colors.network.browser;
        case 'iot': return THEME.colors.network.iot;
        case 'router': return THEME.colors.network.router;
        case 'load_balancer': return THEME.colors.network.loadBalancer;
        case 'gateway': return THEME.colors.network.gateway;
        case 'firewall': return THEME.colors.network.firewall;
        case 'dashboard': return THEME.colors.network.dashboard;
        case 'registry': return THEME.colors.cloud.storage;
        case 'cdn': return '#38bdf8';
        case 'dns': return '#f59e0b';
        case 'vpn': return '#6366f1';
        case 'alert': return '#ef4444';
        case 'log': return '#64748b';
        
        // BIG DATA VARIANTS
        case 'cluster': return THEME.colors.bigData.cluster;
        case 'job': return THEME.colors.bigData.job;
        case 'lake': return THEME.colors.bigData.lake;
        case 'warehouse': return THEME.colors.bigData.warehouse;
        case 'stream': return THEME.colors.bigData.stream;
        case 'machine': return THEME.colors.bigData.machine;

        default: return THEME.colors.standard.service;
    }
};


const CustomNode = ({ id, data, selected, sourcePosition, targetPosition }: NodeProps<NodeData>) => {
  const { setNodes } = useReactFlow();
  const isHorizontal = sourcePosition === Position.Right;
  const [isHovered, setIsHovered] = useState(false);
  
  // Inline Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Audit Status Logic
  const isCritical = data.auditSeverity === 'critical';
  const isWarning = data.auditSeverity === 'warning';
  
  // Cost Status Logic
  const hasCost = data.estimatedCost && data.estimatedCost > 0;
  
  // Highlight Logic (Chat)
  const highlightColor = data.highlightColor;
  const isHighlighted = !!highlightColor;
  
  // Diff Status (Added/Removed/Modified)
  const diffStatus = data.diffStatus;
  const isAdded = diffStatus === 'added';
  const isRemoved = diffStatus === 'removed';
  const isModified = diffStatus === 'modified';
  
  // Sketch Mode Flag
  const isSketch = data.isSketchMode;

  useEffect(() => {
      if (isEditing && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
      }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
      if (isRemoved) return; // Disable interaction on deleted nodes
      e.stopPropagation();
      setIsEditing(true);
      setEditLabel(data.label);
  };

  const handleEditSubmit = () => {
      setIsEditing(false);
      if (editLabel.trim() !== data.label) {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, label: editLabel } };
            }
            return node;
        }));
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleEditSubmit();
      }
      if (e.key === 'Escape') {
          setIsEditing(false);
          setEditLabel(data.label);
      }
  };
  
  // --- LIFELINE (Sequence) ---
  if (data.variant === 'lifeline') {
      return (
          <div className="relative flex flex-col items-center">
             <div className={`relative z-20 px-4 py-2 border-b-4 rounded-lg shadow-md flex flex-col items-center justify-center min-w-[120px] bg-slate-100 border-slate-300 text-slate-900 ${selected ? 'ring-2 ring-indigo-500' : ''}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{data.label}</span>
                  {data.technology && <span className="text-[9px] opacity-70">{data.technology}</span>}
              </div>
              <div className="absolute top-full w-px border-l-2 border-dotted border-slate-500 z-10 opacity-50" style={{ height: data.maxHeight || 600, left: '50%' }}>
              </div>
              <Handle type="source" position={Position.Bottom} className="!opacity-0" />
              <Handle type="target" position={Position.Bottom} className="!opacity-0" />
          </div>
      );
  }

  // --- SPECIAL CASE: BACKEND PORTS (Flat Strips) ---
  if (data.diagramType === DiagramType.BACKEND_DESIGN && data.variant === 'table') {
      const color = highlightColor || getNodeColor(data.diagramType, data.variant, data.label);
      return (
        <div 
            className={`
                relative flex items-center justify-center px-4 py-2 
                rounded-sm border shadow-lg transition-all duration-300
                ${selected ? 'ring-2 ring-white/50 scale-105' : 'hover:scale-105'}
            `}
            style={{ 
                width: 200, 
                height: 40,
                backgroundColor: `${color}20`, // low opacity fill
                borderColor: color,
                boxShadow: isHighlighted ? `0 0 20px ${color}` : `0 0 10px ${color}30`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <input 
                    ref={inputRef}
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onBlur={handleEditSubmit}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full bg-slate-900 text-slate-100 text-xs text-center border-none outline-none font-mono font-bold uppercase tracking-widest"
                />
            ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest truncate" style={{ color: color }}>
                    &lt; {data.label} &gt;
                </span>
            )}
             <Handle type="target" position={Position.Top} className="!opacity-0" />
             <Handle type="source" position={Position.Bottom} className="!opacity-0" />
        </div>
      );
  }

  // --- ICON SELECTION ---
  let IconComponent = isSketch ? SketchGeneric : IsometricGeneric;
  
  if (isSketch) {
      if (data.variant === 'file') IconComponent = SketchFile;
      else {
          switch(data.variant) {
              case 'service': IconComponent = SketchServer; break;
              case 'container': IconComponent = SketchServer; break;
              case 'database': IconComponent = SketchDB; break;
              case 'cloud': IconComponent = SketchCloud; break;
              case 'client': IconComponent = SketchLaptop; break;
              case 'queue': IconComponent = SketchQueue; break;
              case 'security': IconComponent = SketchLock; break;
              case 'ai': IconComponent = SketchAI; break;
              case 'user' as any: IconComponent = SketchUser; break; // Allow for implicit variants
              default: 
                if(data.label.toLowerCase().includes('user')) IconComponent = SketchUser;
                else IconComponent = SketchGeneric;
          }
      }
  } else {
      // ISOMETRIC MAPPING (Existing)
      if (data.variant === 'file') {
          const tech = (data.technology || '').toLowerCase();
          if (tech.includes('parquet')) IconComponent = IsometricParquet;
          else if (tech.includes('json')) IconComponent = IsometricJSON;
          else if (tech.includes('csv')) IconComponent = IsometricCSV;
          else if (tech.includes('txt') || tech.includes('text')) IconComponent = IsometricTXT;
          else IconComponent = IsometricFile;
      } else {
          switch (data.variant) {
              case 'client': IconComponent = IsometricLaptop; break;
              case 'service': IconComponent = IsometricServer; break;
              case 'container': IconComponent = IsometricServer; break; 
              case 'database': IconComponent = IsometricDB; break;
              case 'cloud': IconComponent = IsometricCloud; break;
              case 'api': IconComponent = IsometricCloud; break;
              case 'queue': IconComponent = IsometricQueue; break; 
              case 'security': IconComponent = IsometricLock; break;
              case 'ai': IconComponent = IsometricAI; break;
              case 'function': IconComponent = IsometricAI; break;
              case 'table': IconComponent = IsometricTable; break;
              
              case 'mobile': IconComponent = IsometricMobile; break;
              case 'browser': IconComponent = IsometricBrowser; break;
              case 'iot': IconComponent = IsometricIoT; break;
              case 'router': IconComponent = IsometricRouter; break;
              case 'load_balancer': IconComponent = IsometricLoadBalancer; break;
              case 'dashboard': IconComponent = IsometricDashboard; break;
              case 'gateway': IconComponent = IsometricGateway; break;
              case 'firewall': IconComponent = IsometricFirewall; break;
              case 'registry': IconComponent = IsometricRegistry; break;
              case 'cdn': IconComponent = IsometricCDN; break;
              case 'dns': IconComponent = IsometricDNS; break;
              case 'vpn': IconComponent = IsometricVPN; break;
              case 'alert': IconComponent = IsometricAlert; break;
              case 'log': IconComponent = IsometricLog; break;

              case 'cluster': IconComponent = IsometricCluster; break;
              case 'job': IconComponent = IsometricJob; break;
              case 'lake': IconComponent = IsometricLake; break;
              case 'warehouse': IconComponent = IsometricWarehouse; break;
              case 'stream': IconComponent = IsometricStream; break;
              case 'machine': IconComponent = IsometricMachine; break;

              default: 
                  if (data.label.toLowerCase().includes('user')) IconComponent = IsometricUser; 
                  else IconComponent = IsometricGeneric;
          }
      }
  }

  // --- DYNAMIC COLORING ---
  const borderColor = isCritical ? '#ef4444' : (isWarning ? '#f59e0b' : (highlightColor || getNodeColor(data.diagramType, data.variant, data.label)));

  const targetStyle = isHorizontal ? { left: '10%', top: '60%' } : { left: '50%', top: '20%' };
  const sourceStyle = isHorizontal ? { right: '10%', top: '60%' } : { left: '50%', bottom: '10%' };

  // Tech Icon Overlay
  const specificTechIcon = getTechIcon(data.technology);
  
  // Is Backend Mode? Use distinct, discrete visual style
  const isBackend = data.diagramType === DiagramType.BACKEND_DESIGN;
  
  // Diff Visualization Styles
  const getDiffStyles = () => {
      if (isAdded) return "ring-4 ring-emerald-500 bg-emerald-500/10 scale-105";
      if (isRemoved) return "ring-4 ring-red-500 bg-red-500/10 opacity-70 grayscale contrast-125";
      if (isModified) return "ring-4 ring-amber-500 bg-amber-500/10";
      return "";
  };
  
  // SKETCH MODE RENDER
  if (isSketch) {
      return (
        <div 
            className={`
                relative flex flex-col items-center justify-center p-2 group
                ${getDiffStyles()}
            `}
            style={{ 
                width: THEME.dimensions.nodeWidth, 
                minHeight: THEME.dimensions.nodeHeight,
                zIndex: isHovered || selected ? 999 : 10
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
        >
             {/* Info Toolbar */}
            <NodeToolbar isVisible={selected} position={Position.Top} align="start" offset={10}>
                <div className="bg-white border-2 border-slate-700 rounded shadow-sm p-2 text-left font-[Patrick Hand] max-w-xs">
                     <h4 className="text-lg font-bold text-slate-800">{data.label}</h4>
                     {data.technology && <span className="text-sm text-slate-600 bg-slate-100 px-1">{data.technology}</span>}
                     {data.details && <p className="text-sm text-slate-500 mt-1">{data.details}</p>}
                </div>
            </NodeToolbar>

            {/* Sketch Icon */}
            <div className={`mb-2 transition-transform ${selected || isHovered ? 'scale-110' : ''}`}>
                 <IconComponent size={64} />
            </div>
            
            {/* Label (Simulating handwritten sticker) */}
            <div 
                className={`
                    px-4 py-2 border-2 border-slate-700 bg-white
                    text-slate-800 text-lg font-bold text-center leading-tight
                    shadow-[4px_4px_0px_0px_rgba(51,65,85,0.2)]
                    transform rotate-1 transition-all
                    ${selected ? 'ring-2 ring-indigo-400 rotate-0' : 'hover:-rotate-1'}
                `}
                style={{ fontFamily: '"Patrick Hand", cursive' }}
            >
                {isEditing ? (
                    <input 
                        ref={inputRef}
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-center outline-none border-b border-slate-400"
                    />
                ) : data.label}
            </div>

            {/* Audit Badge Sketch */}
            {(isCritical || isWarning) && (
                <div className="absolute top-0 right-10 text-red-500 animate-pulse">
                     <AlertTriangle className="w-8 h-8" />
                </div>
            )}
            
            {/* Cost Badge Sketch */}
            {hasCost && (
                <div className="absolute bottom-[-10px] right-10 bg-emerald-100 text-emerald-800 border border-emerald-500 px-2 py-0.5 rounded shadow-sm text-sm font-bold -rotate-2">
                    ${data.estimatedCost}
                </div>
            )}

            <Handle type="target" position={targetPosition || Position.Left} className="!w-2 !h-2 !bg-slate-400 !border-2 !border-slate-700" style={targetStyle} />
            <Handle type="source" position={sourcePosition || Position.Right} className="!w-2 !h-2 !bg-slate-400 !border-2 !border-slate-700" style={sourceStyle} />
        </div>
      );
  }

  // ISOMETRIC RENDER (Default)
  return (
    <div 
        className={`relative flex flex-col items-center justify-start group transition-all duration-300 ${isRemoved ? 'pointer-events-none' : ''}`}
        style={{ 
            width: THEME.dimensions.nodeWidth, 
            minHeight: THEME.dimensions.nodeHeight,
            // When hovered or selected, lift it visually above other nodes via z-index
            zIndex: isHovered || selected || isEditing || isHighlighted ? 999 : 10
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
    >
      
      {/* --- INFO BOX (Attached to Top Left) --- */}
      <NodeToolbar isVisible={selected} position={Position.Top} align="start" offset={20}>
         <div className="w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3 text-left animate-in fade-in zoom-in-95 duration-200 origin-bottom-left flex flex-col max-h-64 overflow-hidden">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2 shrink-0">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Component Info</span>
            </div>
            
            <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Label:</span>
                    <p className="text-sm font-medium text-slate-100">{data.label}</p>
                </div>
                
                {data.details && (
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Details:</span>
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700/30 mt-0.5">
                            <MarkdownRenderer content={data.details} className="text-[11px] text-slate-300 leading-relaxed" />
                        </div>
                    </div>
                )}
                
                <div className="flex gap-2 pt-1 flex-wrap">
                     {data.technology && (
                         <div className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-indigo-300">
                             {data.technology}
                         </div>
                     )}
                     {data.stage && (
                         <div className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-emerald-300">
                             {data.stage}
                         </div>
                     )}
                </div>
            </div>
            
            {/* Arrow pointer styling */}
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-slate-900 border-r border-b border-slate-700 transform rotate-45"></div>
         </div>
      </NodeToolbar>

      {/* 1. ISOMETRIC ICON (Now On Top) */}
      <div 
        className={`
            relative z-10 transition-transform duration-500 ease-out mb-[-5px] 
            ${isCritical ? 'iso-critical' : ''} 
            ${isWarning ? 'iso-warning' : ''} 
            ${isHighlighted ? 'iso-glowing' : ''}
            ${isRemoved ? 'grayscale opacity-70' : ''}
        `}
        style={{
            transform: isHovered || selected || isEditing || isHighlighted
                ? 'scale(1.15) translateY(-14px) rotateX(10deg)' 
                : 'rotateX(0deg)',
            filter: isHovered || selected || isEditing || isHighlighted
                ? `drop-shadow(0 25px 25px rgba(0,0,0,0.7))` 
                : `drop-shadow(0 15px 15px rgba(0,0,0,0.5))`
        }}
      >
         <IconComponent size={THEME.dimensions.iconSize} tech={(data.technology||'').toLowerCase()} />
         
         {/* AUDIT BADGE ICON */}
         {(isCritical || isWarning) && (
             <div className="absolute -top-4 -right-4 animate-bounce">
                {isCritical ? (
                    <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" fill="rgba(0,0,0,0.5)" />
                ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" fill="rgba(0,0,0,0.5)" />
                )}
             </div>
         )}

         {/* VISUAL DIFF BADGES */}
         {isAdded && (
             <div className="absolute -top-4 -left-4 animate-bounce">
                 <PlusCircle className="w-8 h-8 text-emerald-400 bg-slate-900 rounded-full" fill="currentColor" />
             </div>
         )}
         {isRemoved && (
             <div className="absolute -top-4 -right-4">
                 <MinusCircle className="w-8 h-8 text-red-500 bg-slate-900 rounded-full" fill="currentColor" />
             </div>
         )}
         {isModified && (
             <div className="absolute -top-4 -left-4 animate-pulse">
                 <RefreshCcw className="w-6 h-6 text-amber-400 bg-slate-900 rounded-full p-1 border border-amber-500" />
             </div>
         )}
      </div>

      {/* 2. LABEL BOX */}
      <div 
        className={`
            px-3 py-2.5
            border-t border-l border-r border-b-2 rounded-xl
            w-full mx-2
            flex flex-col items-center
            z-20
            relative
            backdrop-blur-xl bg-slate-900/60
            transition-all duration-300
            ${isCritical ? 'ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] bg-red-950/40' : ''}
            ${isWarning ? 'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] bg-amber-950/40' : ''}
            ${getDiffStyles()}
            ${(!isCritical && !isWarning && !diffStatus) && (selected || isEditing || isHighlighted
                ? `ring-2 ring-[${borderColor}] scale-105 shadow-[0_0_20px_${borderColor}66]` 
                : 'hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]')
            }
        `}
        style={{ 
            borderColor: selected || isEditing ? THEME.colors.primary : borderColor,
            // If highlighted, override border color
            ...(isHighlighted ? { borderColor: highlightColor, boxShadow: `0 0 20px ${highlightColor}80` } : {}),
            boxShadow: (isHovered && !selected && !isEditing && !isCritical && !isWarning && !isHighlighted && !diffStatus)
                ? `0 10px 25px -5px ${borderColor}40, 0 8px 10px -6px ${borderColor}20` 
                : undefined
        }}
      >
         {/* Tech Icon Logic: Floating Banner (Default) vs Discrete Corner (Backend Design) */}
         {data.technology && !isBackend && (
            <div className="flex items-center gap-1.5 mb-1.5 px-2 py-0.5 rounded-full bg-slate-950/50 border border-slate-800 shadow-inner">
                {specificTechIcon}
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-300">
                    {data.technology}
                </span>
            </div>
         )}

         {/* Editable Label */}
         {isEditing ? (
            <input 
                ref={inputRef}
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-950/50 text-slate-100 text-xs font-bold text-center border-b border-indigo-500 outline-none rounded-sm px-1"
            />
         ) : (
             <span className={`text-xs font-bold text-slate-100 text-center leading-tight break-words w-full cursor-text ${isRemoved ? 'line-through text-slate-500' : ''}`} title="Double click to edit">
                {data.label}
             </span>
         )}
         
         {/* Stage Badge */}
         {data.stage && (
             <span 
                className="absolute -top-3 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-md border text-slate-900 shadow-sm"
                style={{ backgroundColor: borderColor, borderColor: '#fff' }}
             >
                 {data.stage}
             </span>
         )}
         
         {/* PRICE TAG BADGE */}
         {hasCost && (
             <div className="absolute -top-3 -left-1 flex items-center bg-emerald-500 text-emerald-950 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-400 shadow-lg z-30 animate-in zoom-in duration-300">
                 <span>${data.estimatedCost}/mo</span>
             </div>
         )}
         
         {/* AUDIT MESSAGE OVERLAY */}
         {(isCritical || isWarning) && (
             <div className={`mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-900'}`}>
                 {isCritical ? 'Critical Issue' : 'Warning'}
             </div>
         )}

         {/* Discrete Tech Icon for Backend Design (Bottom Left/Right Corner) */}
         {isBackend && data.technology && (
             <div 
                className="absolute bottom-1 right-2 p-1 rounded-md bg-slate-950/50 border border-slate-700/50 flex items-center justify-center transition-all hover:bg-slate-800 hover:scale-110" 
                title={data.technology}
                style={{ width: 24, height: 24 }}
             >
                 {specificTechIcon}
             </div>
         )}
      </div>

      <Handle
        type="target"
        position={targetPosition || Position.Left}
        className="!w-1 !h-1 !bg-transparent !border-none"
        style={targetStyle}
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className="!w-1 !h-1 !bg-transparent !border-none"
        style={sourceStyle}
      />
    </div>
  );
};

export default memo(CustomNode);
