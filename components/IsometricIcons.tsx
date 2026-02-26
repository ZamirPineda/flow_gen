

import React from 'react';

// Reusable defs for gradients (Server, DB, etc.)
export const IsometricDefs = () => (
  <defs>
    {/* GENERIC SERVER (Sleek Metallic Blue/Grey) */}
    <linearGradient id="serverSideR" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#475569" />
      <stop offset="30%" stopColor="#64748b" />
      <stop offset="100%" stopColor="#1e293b" />
    </linearGradient>
    <linearGradient id="serverSideL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f8fafc" />
      <stop offset="20%" stopColor="#cbd5e1" />
      <stop offset="100%" stopColor="#64748b" />
    </linearGradient>
    <linearGradient id="serverTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="50%" stopColor="#f8fafc" />
      <stop offset="100%" stopColor="#94a3b8" />
    </linearGradient>

    {/* SPARK / COMPUTE (Vivid Neon Orange/Red) */}
    <linearGradient id="sparkBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f97316" />
      <stop offset="40%" stopColor="#ea580c" />
      <stop offset="100%" stopColor="#7c2d12" />
    </linearGradient>
    <linearGradient id="sparkTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fff7ed" />
      <stop offset="20%" stopColor="#fed7aa" />
      <stop offset="100%" stopColor="#f97316" />
    </linearGradient>

    {/* INTENSE NEON GLOWS */}
    <linearGradient id="glowGreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#86efac" />
      <stop offset="50%" stopColor="#22c55e" />
      <stop offset="100%" stopColor="#14532d" />
    </linearGradient>
    <linearGradient id="glowRed" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fca5a5" />
      <stop offset="50%" stopColor="#ef4444" />
      <stop offset="100%" stopColor="#7f1d1d" />
    </linearGradient>
    <linearGradient id="glowBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="50%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#1e3a8a" />
    </linearGradient>

    {/* DB GRADIENTS (Glossy Cylinders) */}
    <linearGradient id="dbBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="20%" stopColor="#f59e0b" />
      <stop offset="50%" stopColor="#d97706" />
      <stop offset="85%" stopColor="#78350f" />
      <stop offset="100%" stopColor="#451a03" />
    </linearGradient>

    <linearGradient id="oracleBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fca5a5" />
      <stop offset="20%" stopColor="#ef4444" />
      <stop offset="50%" stopColor="#b91c1c" />
      <stop offset="85%" stopColor="#7f1d1d" />
      <stop offset="100%" stopColor="#450a0a" />
    </linearGradient>

    <linearGradient id="postgresBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="20%" stopColor="#3b82f6" />
      <stop offset="50%" stopColor="#1d4ed8" />
      <stop offset="85%" stopColor="#1e3a8a" />
      <stop offset="100%" stopColor="#172554" />
    </linearGradient>

    <linearGradient id="hadoopBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="20%" stopColor="#eab308" />
      <stop offset="50%" stopColor="#ca8a04" />
      <stop offset="85%" stopColor="#854d0e" />
      <stop offset="100%" stopColor="#422006" />
    </linearGradient>

    <radialGradient id="dbTop" cx="0.4" cy="0.4" r="0.6">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#fef3c7" />
      <stop offset="100%" stopColor="#f59e0b" />
    </radialGradient>

    {/* OTHERS WITH SPECULAR HIGHLIGHTS */}
    <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#60a5fa" />
      <stop offset="30%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#1e40af" />
    </linearGradient>
    <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="30%" stopColor="#cffafe" />
      <stop offset="100%" stopColor="#06b6d4" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="30%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
    <linearGradient id="cubeTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="20%" stopColor="#f1f5f9" />
      <stop offset="100%" stopColor="#94a3b8" />
    </linearGradient>

    {/* AI CHIP GRADIENTS - GEMINI AESTHETIC (Obsidian to Vivid Neon) */}
    <linearGradient id="aiBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#334155" />
      <stop offset="20%" stopColor="#1e293b" />
      <stop offset="100%" stopColor="#020617" />
    </linearGradient>
    <linearGradient id="aiCircuit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f472b6" />
      <stop offset="30%" stopColor="#d946ef" />
      <stop offset="70%" stopColor="#8b5cf6" />
      <stop offset="100%" stopColor="#06b6d4" />
    </linearGradient>

    {/* TABLE GRADIENTS */}
    <linearGradient id="tableSurface" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#e2e8f0" />
    </linearGradient>

    {/* FILE GRADIENTS */}
    <linearGradient id="fileBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#cbd5e1" />
    </linearGradient>

    {/* PARQUET COLUMNS */}
    <linearGradient id="parquetCol1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
    <linearGradient id="parquetCol2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fca5a5" />
      <stop offset="100%" stopColor="#dc2626" />
    </linearGradient>
    <linearGradient id="parquetCol3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="100%" stopColor="#2563eb" />
    </linearGradient>

    {/* NEW GRADIENTS */}
    <linearGradient id="mobileScreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#34d399" />
      <stop offset="100%" stopColor="#047857" />
    </linearGradient>
    <linearGradient id="firewallBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fca5a5" />
      <stop offset="100%" stopColor="#dc2626" />
    </linearGradient>
    <linearGradient id="dashboardScreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#2dd4bf" />
      <stop offset="100%" stopColor="#0f766e" />
    </linearGradient>

    {/* Registry Gradient (Containers) */}
    <linearGradient id="registryBox" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="100%" stopColor="#2563eb" />
    </linearGradient>

    {/* Lake / Water Gradient */}
    <linearGradient id="lakeWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#cffafe" />
      <stop offset="50%" stopColor="#06b6d4" />
      <stop offset="100%" stopColor="#164e63" />
    </linearGradient>
  </defs>
);

interface IsoProps {
  size?: number;
  tech?: string;
}

export const IsometricServer = ({ size = 48, tech = 'default' }: IsoProps) => {
  const isSpark = tech.includes('spark') || tech.includes('databricks');

  // Choose Colors
  const sideR = isSpark ? 'url(#sparkBody)' : 'url(#serverSideR)';
  const sideL = isSpark ? '#ea580c' : 'url(#serverSideL)'; // specific hex for spark left side
  const top = isSpark ? 'url(#sparkTop)' : 'url(#serverTop)';
  const stroke = isSpark ? '#9a3412' : '#1e293b';

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 64 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 82L4 66L60 66L32 82Z" fill="black" fillOpacity="0.5" filter="blur(8px)" />
      <g className="iso-breathing">
        <path d="M32 68 L60 52 L60 20 L32 36 Z" fill={sideR} stroke={stroke} strokeWidth="0.5" />
        <path d="M4 52 L32 68 L32 36 L4 20 Z" fill={sideL} stroke={stroke} strokeWidth="0.5" />
        <path d="M32 4 L60 20 L32 36 L4 20 Z" fill={top} />
        {/* Edge Specular Highlight */}
        <path d="M32 4 L60 20 L32 36 L4 20 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1" strokeOpacity="0.8" />
        <path d="M4 20 L32 36" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      </g>
      {/* Front Panel */}
      <path d="M6 24 L30 38 L30 46 L6 32 Z" fill={isSpark ? "#fff7ed" : "#f1f5f9"} />
      <path d="M30 46 L6 32 L6 31 L30 45 Z" fill={isSpark ? "#fdba74" : "#94a3b8"} />
      <path d="M6 34 L30 48 L30 56 L6 42 Z" fill={isSpark ? "#fff7ed" : "#f1f5f9"} />
      <path d="M30 56 L6 42 L6 41 L30 55 Z" fill={isSpark ? "#fdba74" : "#94a3b8"} />

      {/* Aggressive LED blinking */}
      <circle cx="10" cy="26" r="2" fill="url(#glowGreen)" filter="drop-shadow(0 0 3px #4ade80)" className="iso-pulsing-1" />
      <circle cx="14" cy="28" r="2" fill="url(#glowRed)" filter="drop-shadow(0 0 3px #f87171)" className="iso-pulsing-2" />
    </svg>
  );
};

export const IsometricDB = ({ size = 48, tech = 'default' }: IsoProps) => {
  let bodyFill = 'url(#dbBody)';
  let strokeColor = '#78350f';
  let topColor = 'url(#dbTop)';

  if (tech.includes('oracle')) {
    bodyFill = 'url(#oracleBody)'; // Red
    strokeColor = '#450a0a';
    topColor = '#fee2e2';
  } else if (tech.includes('postgres') || tech.includes('db2')) {
    bodyFill = 'url(#postgresBody)'; // Blue
    strokeColor = '#172554';
    topColor = '#dbeafe';
  } else if (tech.includes('hadoop') || tech.includes('hive')) {
    bodyFill = 'url(#hadoopBody)'; // Yellow
    strokeColor = '#713f12';
    topColor = '#fef9c3';
  }

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 64 76" fill="none">
      <ellipse cx="32" cy="68" rx="28" ry="10" fill="black" fillOpacity="0.4" filter="blur(8px)" />
      {/* Whole DB body breathes */}
      <g className="iso-breathing">
        <path d="M4 24 V56 C4 66 16.5 74 32 74 C47.5 74 60 66 60 56 V24" fill={bodyFill} stroke={strokeColor} strokeWidth="0.5" />
        {/* Specular rings on cylinder */}
        <path d="M4 36 C4 46 16.5 54 32 54 C47.5 54 60 46 60 36" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
        <path d="M4 35 C4 45 16.5 53 32 53 C47.5 53 60 45 60 35" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" />
        <ellipse cx="32" cy="24" rx="28" ry="14" fill={topColor} stroke={strokeColor} strokeWidth="0.5" />
        {/* Top Edge Highlight */}
        <ellipse cx="32" cy="24" rx="27" ry="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none" className="iso-glowing" />
      </g>
    </svg>
  );
};

export const IsometricQueue = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M14 44 L32 54 L50 44 L32 34 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Pipe Body - Bottom Half */}
      <path d="M16 36 L32 44 L48 36 L48 24 L32 32 L16 24 Z" fill="#be185d" stroke="#831843" strokeWidth="0.5" />
      <path d="M16 36 L16 24" stroke="#831843" strokeWidth="0.5" />

      {/* Items inside */}
      <path d="M22 26 L30 30 L30 22 L22 18 Z" fill="#f472b6" />
      <path d="M22 26 L14 22 L14 14 L22 18 Z" fill="#ec4899" />
      <path d="M14 22 L30 30 L30 34 L14 26 Z" fill="#db2777" />

      <path d="M36 33 L44 37 L44 29 L36 25 Z" fill="#f472b6" className="iso-pulsing-1" />
      <path d="M36 33 L28 29 L28 21 L36 25 Z" fill="#ec4899" className="iso-pulsing-1" />
      <path d="M28 29 L44 37 L44 41 L28 33 Z" fill="#db2777" className="iso-pulsing-1" />

      {/* Pipe Body - Top Outline (Glass effect) */}
      <path d="M16 24 L32 32 L48 24 L32 16 Z" stroke="#fbcfe8" strokeWidth="1" fill="#be185d" fillOpacity="0.2" />
    </g>
  </svg>
);

export const IsometricLaptop = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M2 50 L20 60 L62 46 L44 36 Z" fill="black" fillOpacity="0.3" filter="blur(4px)" />
    <path d="M2 43 L32 59 L32 62 L2 46 Z" fill="#1e293b" />
    <path d="M32 59 L62 43 L62 46 L32 62 Z" fill="#0f172a" />
    <path d="M2 43 L32 59 L62 43 L32 27 Z" fill="#475569" />
    <path d="M2 43 L2 13 L32 0 L32 27 Z" fill="#64748b" />
    <path d="M32 27 L32 0 L62 13 L62 43 Z" fill="#e2e8f0" />
    {/* Screen glow oscillates */}
    <path d="M35 25 L35 4 L59 15 L59 39 Z" fill="url(#screenGrad)" className="iso-pulsing-1" />
    <path d="M35 25 L50 18 L59 15 L35 4 Z" fill="white" fillOpacity="0.15" />
  </svg>
);

export const IsometricCloud = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <ellipse cx="32" cy="52" rx="26" ry="10" fill="black" fillOpacity="0.3" filter="blur(8px)" />
      <path d="M16 42 L16 32 L32 22 L32 32 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.5" />
      <path d="M16 42 L32 52 L32 32 L16 32 Z" fill="#06b6d4" />
      <path d="M32 22 L32 42 L48 52 L48 32 Z" fill="#0e7490" />
      <path d="M16 32 L32 22 L48 32 L32 42 Z" fill="url(#cloudGrad)" className="iso-glowing" stroke="white" strokeWidth="1" />
      <path d="M16 32 L32 42" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </g>
  </svg>
);

export const IsometricUser = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 64 96" fill="none">
    <g className="iso-floating">
      <ellipse cx="32" cy="86" rx="18" ry="6" fill="black" fillOpacity="0.3" filter="blur(4px)" />
      <path d="M32 4 L52 14 L32 24 L12 14 Z" fill="#fef2f2" />
      <path d="M12 14 L32 24 L32 44 L12 34 Z" fill="#f87171" />
      <path d="M32 24 L52 14 L52 34 L32 44 Z" fill="#b91c1c" />
      <path d="M32 50 L56 38 L60 80 L32 92 Z" fill="#0f172a" />
      <path d="M8 38 L32 50 L32 92 L4 80 Z" fill="#334155" />
      <path d="M32 50 L36 54 L32 68 L28 54 Z" fill="#ef4444" />
    </g>
  </svg>
);

export const IsometricLock = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M12 52 L32 62 L52 52 L32 42 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />
      <path d="M32 40 L52 30 L52 50 L32 60 Z" fill="#b45309" />
      <path d="M12 30 L32 40 L32 60 L12 50 Z" fill="#f59e0b" />
      <path d="M12 30 L32 20 L52 30 L32 40 Z" fill="url(#goldGrad)" className="iso-glowing" />
      <path d="M20 30 V15 A12 12 0 0 1 44 15 V30" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
    </g>
  </svg>
);

export const IsometricAI = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      {/* Shadow */}
      <path d="M12 52 L32 62 L52 52 L32 42 Z" fill="black" fillOpacity="0.3" filter="blur(4px)" />
      {/* Base Chip */}
      <path d="M12 40 L32 50 L52 40 L32 30 Z" fill="#1e1e1e" />
      <path d="M12 40 L12 44 L32 54 L32 50 Z" fill="#3f3f46" /> {/* Side L */}
      <path d="M52 40 L52 44 L32 54 L32 50 Z" fill="#52525b" /> {/* Side R */}

      {/* Top Surface Specular */}
      <path d="M14 39 L32 48 L50 39 L32 31 Z" fill="url(#aiBody)" />
      <path d="M16 39 L32 47 L48 39 L32 32 Z" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />

      {/* Dynamic Circuit Lines */}
      <path d="M26 34 L32 37 L38 34" stroke="url(#aiCircuit)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 38 L26 41" stroke="url(#aiCircuit)" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 41 L44 38" stroke="url(#aiCircuit)" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 43 L32 48" stroke="url(#aiCircuit)" strokeWidth="2" strokeLinecap="round" />

      {/* Glowing Core (Deep Bloom) */}
      <circle cx="32" cy="40" r="3.5" fill="#f0abfc" className="iso-pulsing-1" filter="drop-shadow(0 0 6px #d946ef) drop-shadow(0 0 12px #c026d3)" />
      <path d="M32 40 L32 16" stroke="url(#aiCircuit)" strokeWidth="1.5" strokeDasharray="3 3" className="iso-glowing" opacity="0.8" />
      <circle cx="32" cy="16" r="2.5" fill="#67e8f9" className="iso-pulsing-2" filter="drop-shadow(0 0 5px #06b6d4)" />
    </g>
  </svg>
);

export const IsometricTable = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 64 64" fill="none">
    <path d="M2 42 L32 58 L62 42 L32 26 Z" fill="black" fillOpacity="0.1" filter="blur(4px)" />
    <g className="iso-floating">
      {/* Table Slab */}
      <path d="M2 38 L32 54 L62 38 L32 22 Z" fill="url(#tableSurface)" stroke="#cbd5e1" strokeWidth="0.5" />
      <path d="M2 38 L2 42 L32 58 L32 54 Z" fill="#94a3b8" />
      <path d="M62 38 L62 42 L32 58 L32 54 Z" fill="#64748b" />

      {/* Grid Lines */}
      <path d="M17 30 L47 46" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M32 22 L32 54" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M47 30 L17 46" stroke="#cbd5e1" strokeWidth="1" />

      {/* Header Highlight */}
      <path d="M12 28 L32 38 L52 28 L32 18 Z" fill="#f1f5f9" fillOpacity="0.5" />
    </g>
  </svg>
);

// --- SPECIFIC FILE ICONS ---

export const IsometricParquet = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M20 54 L34 62 L34 22 L20 14 Z" fill="black" fillOpacity="0.15" filter="blur(3px)" />

      {/* Column 1 */}
      <path d="M18 52 L26 56 L26 16 L18 12 Z" fill="url(#parquetCol1)" stroke="#d97706" strokeWidth="0.5" />
      <path d="M18 12 L26 16 L30 14 L22 10 Z" fill="#fef3c7" /> {/* Top */}
      <path d="M26 56 L30 54 L30 14 L26 16 Z" fill="#d97706" /> {/* Side */}

      {/* Column 2 */}
      <path d="M32 50 L40 54 L40 14 L32 10 Z" fill="url(#parquetCol2)" stroke="#b91c1c" strokeWidth="0.5" />
      <path d="M32 10 L40 14 L44 12 L36 8 Z" fill="#fee2e2" />
      <path d="M40 54 L44 52 L44 12 L40 14 Z" fill="#b91c1c" />

      {/* Column 3 */}
      <path d="M25 48 L33 52 L33 12 L25 8 Z" fill="url(#parquetCol3)" stroke="#1d4ed8" strokeWidth="0.5" />
      <path d="M25 8 L33 12 L37 10 L29 6 Z" fill="#dbeafe" />
      <path d="M33 52 L37 50 L37 10 L33 12 Z" fill="#1d4ed8" />
    </g>
  </svg>
);

export const IsometricJSON = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M16 48 L32 56 L48 48 L32 40 Z" fill="black" fillOpacity="0.2" filter="blur(3px)" />

      {/* Box Body */}
      <path d="M16 38 L32 46 L32 20 L16 12 Z" fill="#facc15" stroke="#a16207" strokeWidth="0.5" />
      <path d="M16 38 L32 46 L48 38 L32 30 Z" fill="#fef08a" />
      <path d="M48 38 L48 12 L32 20 L32 46 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.5" />
      <path d="M32 20 L48 12 L32 4 L16 12 Z" fill="#fefce8" stroke="#facc15" strokeWidth="0.5" />

      {/* Curly Braces */}
      <path d="M20 32 L22 34 L22 24 L20 26" stroke="#713f12" strokeWidth="2" fill="none" transform="rotate(-20 22 30)" />
      <path d="M44 26 L42 24 L42 34 L44 32" stroke="#713f12" strokeWidth="2" fill="none" transform="rotate(-20 42 30)" />
    </g>
  </svg>
);

export const IsometricCSV = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      {/* Base Sheet */}
      <path d="M16 48 L32 56 L48 48 L32 40 Z" fill="black" fillOpacity="0.2" filter="blur(3px)" />
      <path d="M16 38 L32 46 L48 38 L32 30 Z" fill="#4ade80" stroke="#166534" strokeWidth="0.5" />
      <path d="M32 46 L32 20 L48 12 L48 38 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.5" />
      <path d="M32 46 L16 38 L16 12 L32 20 Z" fill="#22c55e" stroke="#166534" strokeWidth="0.5" />
      <path d="M32 20 L48 12 L32 4 L16 12 Z" fill="#dcfce7" />

      {/* Grid Pattern */}
      <path d="M20 22 L28 26" stroke="#fff" strokeWidth="1" />
      <path d="M20 28 L28 32" stroke="#fff" strokeWidth="1" />
      <path d="M24 16 L24 40" stroke="#fff" strokeWidth="1" />

      <path d="M36 18 L44 14" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <path d="M36 24 L44 20" stroke="#fff" strokeWidth="1" opacity="0.5" />

      {/* Comma Accent */}
      <text x="32" y="32" fontSize="14" fill="#064e3b" fontFamily="monospace" fontWeight="bold" transform="rotate(10 32 32)">,</text>
    </g>
  </svg>
);

export const IsometricTXT = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M20 54 L34 62 L34 22 L20 14 Z" fill="black" fillOpacity="0.15" filter="blur(3px)" />
      {/* Document */}
      <path d="M28 58 L42 50 L42 10 L28 18 Z" fill="url(#fileBody)" stroke="#94a3b8" strokeWidth="0.5" />
      <path d="M28 58 L24 56 L24 16 L28 18 Z" fill="#e2e8f0" />

      {/* Simple Lines */}
      <path d="M30 22 L40 17" stroke="#64748b" strokeWidth="1" />
      <path d="M30 26 L38 22" stroke="#64748b" strokeWidth="1" />
      <path d="M30 30 L39 25" stroke="#64748b" strokeWidth="1" />
      <path d="M30 34 L36 30" stroke="#64748b" strokeWidth="1" />
      <path d="M30 38 L40 33" stroke="#64748b" strokeWidth="1" />
    </g>
  </svg>
);

export const IsometricFile = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M20 54 L34 62 L34 22 L20 14 Z" fill="black" fillOpacity="0.15" filter="blur(3px)" />
      {/* Standing Document */}
      <path d="M28 58 L42 50 L42 10 L28 18 Z" fill="url(#fileBody)" stroke="#94a3b8" strokeWidth="0.5" />
      <path d="M28 58 L24 56 L24 16 L28 18 Z" fill="#e2e8f0" />

      {/* Lines of text */}
      <path d="M32 24 L38 21" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 28 L38 25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 32 L38 29" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 36 L38 33" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const IsometricGeneric = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-breathing">
      <path d="M32 4 L64 20 L32 36 L0 20 Z" fill="url(#cubeTop)" stroke="white" strokeWidth="0.5" />
      <path d="M0 20 L32 36 L32 60 L0 44 Z" fill="#94a3b8" />
      <path d="M32 36 L64 20 L64 44 L32 60 Z" fill="#64748b" />
    </g>
  </svg>
);


// --- NEW COMPONENT ICONS ---

export const IsometricMobile = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M24 52 L36 58 L52 50 L40 44 Z" fill="black" fillOpacity="0.2" filter="blur(3px)" />

      {/* Phone Body */}
      <path d="M26 48 L34 52 L34 16 L26 12 Z" fill="#334155" />
      <path d="M34 52 L42 48 L42 12 L34 16 Z" fill="#1e293b" />
      <path d="M26 12 L34 16 L42 12 L34 8 Z" fill="#475569" />

      {/* Screen */}
      <path d="M28 46 L34 49 L34 19 L28 16 Z" fill="url(#mobileScreen)" className="iso-pulsing-1" />
      <path d="M34 49 L40 46 L40 16 L34 19 Z" fill="#059669" />

      {/* Notch/Button */}
      <circle cx="34" cy="50" r="1" fill="#fff" opacity="0.5" />
    </g>
  </svg>
);

export const IsometricBrowser = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M12 48 L32 58 L52 48 L32 38 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Window Frame */}
      <path d="M12 36 L32 46 L32 16 L12 6 Z" fill="#e2e8f0" />
      <path d="M32 46 L52 36 L52 6 L32 16 Z" fill="#cbd5e1" />

      {/* Header Bar */}
      <path d="M14 12 L32 21 L50 12 L32 3 Z" fill="#3b82f6" />

      {/* Screen Content */}
      <path d="M16 34 L32 42 L32 24 L16 16 Z" fill="#fff" />
      <path d="M32 42 L48 34 L48 16 L32 24 Z" fill="#f1f5f9" />

      {/* Fake Content Lines */}
      <path d="M20 20 L28 24" stroke="#94a3b8" strokeWidth="2" />
      <path d="M20 24 L28 28" stroke="#94a3b8" strokeWidth="2" />
      <path d="M36 24 L44 20" stroke="#94a3b8" strokeWidth="2" />
    </g>
  </svg>
);

export const IsometricIoT = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-breathing">
      <path d="M20 44 L32 50 L44 44 L32 38 Z" fill="black" fillOpacity="0.3" filter="blur(3px)" />

      {/* Main Board */}
      <path d="M18 36 L32 43 L46 36 L32 29 Z" fill="#065f46" stroke="#047857" strokeWidth="0.5" />
      <path d="M18 36 L18 38 L32 45 L32 43 Z" fill="#064e3b" />
      <path d="M46 36 L46 38 L32 45 L32 43 Z" fill="#022c22" />

      {/* Components */}
      <path d="M28 36 L32 38 L36 36 L32 34 Z" fill="#10b981" />
      <path d="M32 34 L32 20" stroke="#10b981" strokeWidth="1" />
      <circle cx="32" cy="20" r="2" fill="#34d399" className="iso-pulsing-1" />

      {/* Antenna */}
      <path d="M32 20 L32 10" stroke="#34d399" strokeWidth="0.5" />
      <path d="M28 10 L36 10" stroke="#34d399" strokeWidth="0.5" />
    </g>
  </svg>
);

export const IsometricRouter = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M14 42 L32 50 L50 42 L32 34 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Router Box */}
      <path d="M16 34 L32 42 L48 34 L32 26 Z" fill="#4c1d95" />
      <path d="M16 34 L16 38 L32 46 L32 42 Z" fill="#5b21b6" />
      <path d="M48 34 L48 38 L32 46 L32 42 Z" fill="#2e1065" />

      {/* Arrows */}
      <path d="M26 32 L32 35 L38 32" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 35 L32 29" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const IsometricLoadBalancer = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M14 42 L32 50 L50 42 L32 34 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Base */}
      <path d="M16 34 L32 42 L48 34 L32 26 Z" fill="#1e3a8a" />
      <path d="M16 34 L16 38 L32 46 L32 42 Z" fill="#1e40af" />
      <path d="M48 34 L48 38 L32 46 L32 42 Z" fill="#172554" />

      {/* Diverging arrows */}
      <path d="M32 34 L32 24" stroke="#60a5fa" strokeWidth="2" />
      <path d="M32 24 L24 18" stroke="#60a5fa" strokeWidth="2" />
      <path d="M32 24 L40 18" stroke="#60a5fa" strokeWidth="2" />

      {/* Arrow heads */}
      <path d="M22 18 L26 16 L25 20" fill="#60a5fa" />
      <path d="M42 18 L38 16 L39 20" fill="#60a5fa" />
    </g>
  </svg>
);

export const IsometricDashboard = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M12 48 L32 58 L52 48 L32 38 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Monitor Base */}
      <path d="M24 44 L32 48 L40 44 L32 40 Z" fill="#334155" />
      <path d="M28 42 L28 34 L36 34 L36 42 Z" fill="#475569" />

      {/* Screen Frame */}
      <path d="M10 34 L32 44 L54 34 L32 24 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <path d="M10 34 L10 12 L32 2 L32 24 Z" fill="#1e293b" />
      <path d="M54 34 L54 12 L32 2 L32 24 Z" fill="#0f172a" />

      {/* Screen Content */}
      <path d="M12 32 L32 41 L52 32 L32 23 Z" fill="url(#dashboardScreen)" className="iso-pulsing-1" />
      <path d="M12 32 L12 14 L32 5 L32 23 Z" fill="url(#dashboardScreen)" opacity="0.8" />
      <path d="M52 32 L52 14 L32 5 L32 23 Z" fill="url(#dashboardScreen)" opacity="0.6" />

      {/* Charts */}
      <path d="M16 28 L20 22 L24 26 L28 18" stroke="#fff" strokeWidth="1" opacity="0.8" fill="none" />
      <rect x="36" y="16" width="4" height="12" fill="#fff" opacity="0.5" transform="skewY(-20)" />
      <rect x="42" y="12" width="4" height="16" fill="#fff" opacity="0.7" transform="skewY(-20)" />
    </g>
  </svg>
);

export const IsometricGateway = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M12 42 L32 52 L52 42 L32 32 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Archway Left */}
      <path d="M16 40 L24 44 L24 14 L16 10 Z" fill="#c026d3" />
      <path d="M16 40 L12 38 L12 8 L16 10 Z" fill="#a21caf" />

      {/* Archway Right */}
      <path d="M40 44 L48 40 L48 10 L40 14 Z" fill="#c026d3" />
      <path d="M48 40 L52 38 L52 8 L48 10 Z" fill="#a21caf" />

      {/* Top Arch */}
      <path d="M16 10 L32 2 L48 10 L48 14 L32 6 L16 14 Z" fill="#e879f9" />

      {/* Portal Field */}
      <path d="M24 44 L40 44 L40 14 L24 14 Z" fill="url(#aiCircuit)" opacity="0.6" className="iso-pulsing-1" />
    </g>
  </svg>
);

export const IsometricFirewall = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M16 46 L32 54 L48 46 L32 38 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Wall Body */}
      <path d="M16 38 L32 46 L48 38 L32 30 Z" fill="#b91c1c" />
      <path d="M16 38 L16 44 L32 52 L32 46 Z" fill="#991b1b" />
      <path d="M48 38 L48 44 L32 52 L32 46 Z" fill="#7f1d1d" />

      {/* Bricks Pattern */}
      <path d="M24 42 L24 48" stroke="#fca5a5" strokeWidth="0.5" />
      <path d="M40 42 L40 48" stroke="#fca5a5" strokeWidth="0.5" />
      <path d="M16 41 L32 49 L48 41" stroke="#fca5a5" strokeWidth="0.5" />

      {/* Flame Icon on Top */}
      <path d="M32 30 L32 14" stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M32 28 C28 24 26 20 28 16 C30 12 34 12 36 16 C38 20 36 24 32 28 Z" fill="#ef4444" className="iso-pulsing-2" />
      <path d="M32 26 C30 24 29 22 30 20 C31 18 33 18 34 20 C35 22 34 24 32 26 Z" fill="#fbbf24" />
    </g>
  </svg>
);

export const IsometricRegistry = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M16 46 L32 54 L48 46 L32 38 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />
      {/* Box Stack */}
      <path d="M18 38 L32 45 L46 38 L32 31 Z" fill="url(#registryBox)" stroke="#1d4ed8" strokeWidth="0.5" />
      <path d="M18 38 L18 42 L32 49 L32 45 Z" fill="#1e3a8a" />
      <path d="M46 38 L46 42 L32 49 L32 45 Z" fill="#172554" />

      {/* Second Box Stacked */}
      <path d="M18 28 L32 35 L46 28 L32 21 Z" fill="url(#registryBox)" stroke="#1d4ed8" strokeWidth="0.5" />
      <path d="M18 28 L18 32 L32 39 L32 35 Z" fill="#1e3a8a" />
      <path d="M46 28 L46 32 L32 39 L32 35 Z" fill="#172554" />

      {/* Label */}
      <path d="M26 26 L32 29 L38 26" stroke="white" strokeWidth="1" opacity="0.5" />
    </g>
  </svg>
);

export const IsometricCDN = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-breathing">
      <path d="M12 48 L32 58 L52 48 L32 38 Z" fill="black" fillOpacity="0.2" filter="blur(6px)" />

      {/* Globe Grid Base */}
      <ellipse cx="32" cy="38" rx="20" ry="10" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M32 28 V48" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />

      {/* Edge Nodes */}
      <circle cx="16" cy="38" r="4" fill="#38bdf8" />
      <circle cx="48" cy="38" r="4" fill="#38bdf8" />
      <circle cx="32" cy="48" r="4" fill="#38bdf8" />
      <circle cx="32" cy="28" r="4" fill="#38bdf8" />

      {/* Lightning Connection */}
      <path d="M32 28 L16 38 L32 48 L48 38 Z" stroke="#e0f2fe" strokeWidth="1" fill="#0ea5e9" fillOpacity="0.2" className="iso-pulsing-1" />
    </g>
  </svg>
);

export const IsometricDNS = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M20 50 L32 56 L44 50 L32 44 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Book/Registry */}
      <path d="M22 46 L32 52 L42 46 L32 40 Z" fill="#f59e0b" />
      <path d="M22 46 L22 16 L32 10 L32 40 Z" fill="#d97706" />
      <path d="M42 46 L42 16 L32 10 L32 40 Z" fill="#b45309" />

      {/* Spine */}
      <path d="M32 10 L32 52" stroke="#78350f" strokeWidth="1" />

      {/* Magnifying Glass */}
      <circle cx="40" cy="24" r="8" stroke="#fff" strokeWidth="2" fill="#ffffff20" />
      <path d="M34 30 L28 36" stroke="#fff" strokeWidth="3" />
    </g>
  </svg>
);

export const IsometricVPN = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-breathing">
      <path d="M12 42 L32 52 L52 42 L32 32 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Tunnel */}
      <path d="M16 40 Q32 56 48 40" stroke="#6366f1" strokeWidth="14" strokeLinecap="round" opacity="0.2" fill="none" />
      <path d="M16 40 Q32 56 48 40" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeDasharray="4 4" fill="none" className="iso-glowing" />

      {/* Padlock Center */}
      <rect x="26" y="28" width="12" height="10" rx="2" fill="#4f46e5" />
      <path d="M29 28 V24 A3 3 0 0 1 35 24 V28" stroke="#a5b4fc" strokeWidth="2" />
    </g>
  </svg>
);

export const IsometricAlert = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-pulsing-1">
      <path d="M20 50 L32 56 L44 50 L32 44 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />
      {/* Bell Shape */}
      <path d="M32 10 C24 10 20 28 16 36 L14 40 H50 L48 36 C44 28 40 10 32 10 Z" fill="#ef4444" />
      <path d="M32 10 C28 10 26 28 24 36" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="32" cy="46" r="3" fill="#b91c1c" />
      <path d="M44 18 L50 12" stroke="#ef4444" strokeWidth="2" />
      <path d="M20 18 L14 12" stroke="#ef4444" strokeWidth="2" />
    </g>
  </svg>
);

export const IsometricLog = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M20 54 L34 62 L34 22 L20 14 Z" fill="black" fillOpacity="0.15" filter="blur(3px)" />
      {/* Scroll Paper */}
      <path d="M26 58 L40 50 L40 10 L26 18 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />

      {/* Log Lines */}
      <path d="M30 22 L36 19" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 26 L38 23" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 30 L35 27" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 34 L37 31" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 38 L36 35" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Roll Bottom */}
      <path d="M26 58 C22 60 22 56 26 54 L40 46" fill="none" stroke="#94a3b8" />
    </g>
  </svg>
);

// --- BIG DATA ICONS ---

export const IsometricCluster = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M10 46 L32 58 L54 46 L32 34 Z" fill="black" fillOpacity="0.2" filter="blur(5px)" />

      {/* Three Servers Linked */}
      {/* Center Server */}
      <path d="M26 28 L38 34 L38 14 L26 8 Z" fill="#6366f1" stroke="#4f46e5" strokeWidth="0.5" />
      <path d="M26 28 L18 24 L18 4 L26 8 Z" fill="#818cf8" />
      <path d="M38 34 L46 30 L46 10 L38 14 Z" fill="#4338ca" />

      {/* Left Small Server */}
      <path d="M10 38 L18 42 L18 28 L10 24 Z" fill="#818cf8" />
      <path d="M18 42 L24 39 L24 25 L18 28 Z" fill="#6366f1" />

      {/* Right Small Server */}
      <path d="M46 38 L54 34 L54 20 L46 24 Z" fill="#4338ca" />
      <path d="M40 41 L46 38 L46 24 L40 27 Z" fill="#6366f1" />

      {/* Connections */}
      <path d="M26 18 L18 30" stroke="#c7d2fe" strokeWidth="1" strokeDasharray="2 1" />
      <path d="M38 18 L46 30" stroke="#c7d2fe" strokeWidth="1" strokeDasharray="2 1" />
    </g>
  </svg>
);

export const IsometricJob = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-breathing">
      <path d="M16 44 L32 52 L48 44 L32 36 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Gear Shape - Simplified Hexagon with teeth hint */}
      <path d="M32 14 L48 22 L48 42 L32 50 L16 42 L16 22 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
      <path d="M32 24 L40 28 L40 38 L32 42 L24 38 L24 28 Z" fill="#1e1e1e" />

      {/* Inner Rotating part */}
      <path d="M32 33 L36 31 L32 29 L28 31 Z" fill="#fbbf24" className="iso-pulsing-1" />

      {/* Teeth details */}
      <path d="M32 10 V14" stroke="#b45309" strokeWidth="2" />
      <path d="M32 50 V54" stroke="#b45309" strokeWidth="2" />
      <path d="M52 32 H48" stroke="#b45309" strokeWidth="2" />
      <path d="M16 32 H12" stroke="#b45309" strokeWidth="2" />
    </g>
  </svg>
);

export const IsometricLake = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M12 44 L32 54 L52 44 L32 34 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Basin */}
      <path d="M12 30 L32 40 L52 30 L52 38 L32 48 L12 38 Z" fill="#0e7490" />
      <path d="M12 30 L32 40 L52 30 L32 20 Z" fill="url(#lakeWater)" />

      {/* Waves */}
      <path d="M20 30 Q26 34 32 30 T44 30" stroke="#fff" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M24 26 Q30 30 36 26" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
    </g>
  </svg>
);

export const IsometricWarehouse = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M10 46 L32 56 L54 46 L32 36 Z" fill="black" fillOpacity="0.2" filter="blur(5px)" />

      {/* Massive Block */}
      <path d="M14 42 L32 50 L50 42 L50 16 L32 24 L14 16 Z" fill="#64748b" stroke="#475569" strokeWidth="0.5" />
      <path d="M14 42 L14 16 L32 8 L32 34 Z" fill="#94a3b8" />
      <path d="M32 50 L32 24 L50 16 L50 42 Z" fill="#475569" />

      {/* Grid Windows */}
      <path d="M18 20 L28 24 M18 24 L28 28 M18 28 L28 32" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
      <path d="M36 26 L46 22 M36 30 L46 26 M36 34 L46 30" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
    </g>
  </svg>
);

export const IsometricStream = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-pulsing-1">
      {/* 3 Pipes/Streams */}
      <path d="M10 40 L54 20" stroke="#c026d3" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      <path d="M10 32 L54 12" stroke="#d946ef" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      <path d="M10 48 L54 28" stroke="#a21caf" strokeWidth="6" strokeLinecap="round" opacity="0.3" />

      {/* Moving Particles */}
      <circle cx="20" cy="35" r="3" fill="#f0abfc" />
      <circle cx="32" cy="30" r="3" fill="#e879f9" />
      <circle cx="44" cy="25" r="3" fill="#d946ef" />
    </g>
  </svg>
);

export const IsometricMachine = ({ size = 48 }: IsoProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g className="iso-floating">
      <path d="M16 48 L32 56 L48 48 L32 40 Z" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Bot Head */}
      <path d="M20 40 L32 46 L44 40 L44 20 L32 14 L20 20 Z" fill="#7c3aed" />
      <path d="M20 20 L32 26 L44 20 L32 14 Z" fill="#a78bfa" />
      <path d="M20 40 L20 20 L32 26 L32 46 Z" fill="#8b5cf6" />
      <path d="M44 40 L44 20 L32 26 L32 46 Z" fill="#6d28d9" />

      {/* Eye */}
      <path d="M26 30 L38 24 L38 28 L26 34 Z" fill="#000" />
      <circle cx="32" cy="29" r="2" fill="#ef4444" className="iso-pulsing-1" />
    </g>
  </svg>
);
