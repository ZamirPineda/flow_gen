import React from 'react';
import { Database, Code, HardDrive, Layers, Archive, Workflow, Cpu, Cloud } from 'lucide-react';

// --- CUSTOM TECH ICONS ---
export const SparkIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>
);
export const KafkaIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0"><circle cx="12" cy="12" r="10" fill="#1e1e1e" /><path d="M7 6V18" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M7 12L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M7 12L16 18" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
);
export const ParquetIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="5" height="16" rx="1" fillOpacity="0.8"/><rect x="10" y="4" width="5" height="16" rx="1" fillOpacity="0.6"/><rect x="16" y="4" width="4" height="16" rx="1" fillOpacity="0.4"/></svg>
);
export const DatabricksIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M2 12L12 4L22 12L12 20L2 12Z" fillOpacity="0.3" /><path d="M5 12L12 6.5L19 12L12 17.5L5 12Z" fill="currentColor" /></svg>
);
export const SnowflakeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="m17 8-10 8" /><path d="m7 8 10 8" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /></svg>
);
export const PythonIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 2 8 3 8 5V7H14V9H6V5C6 3 5 2 3 2H12ZM12 22C15 22 16 21 16 19V17H10V15H18V19C18 21 19 22 21 22H12Z" /></svg>
);
export const JavaIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 18c4 0 7-2 7-5s-3-5-7-5-7 2-7 5 3 5 7 5z" /><path d="M16 8v-2c0-2-1-3-4-3s-4 1-4 3v2" /><path d="M18 13h2" /></svg>
);
export const DockerIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4 10h3v3h-3zM8 10h3v3h-3zM12 10h3v3h-3zM4 6h3v3h-3zM8 6h3v3h-3zM4 14h3v3h-3zM8 14h3v3h-3zM12 14h3v3h-3zM16 14h3v3h-3z" /><path d="M2 18c0 2 2 4 10 4s10-2 10-4c0-3-4-4-6-4" opacity="0.5" /></svg>
);
export const HadoopElephant = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4 16C4 16 3 14 5 12C7 10 9 10 9 10C9 10 8 6 12 4C16 2 20 4 20 8C20 12 18 14 18 16V20H14V16H10V20H6V16H4Z" /></svg>
);
export const CloudCustomIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" /><path d="M12 13.5V2" /><path d="M12 2l4 4" /><path d="M12 2 8 6" /></svg>
);

// Tech Icon Mapper
export const getTechIcon = (tech?: string) => {
    if (!tech) return null;
    const t = tech.toLowerCase();
    
    if (t.includes('spark')) return <SparkIcon className="w-4 h-4 text-orange-500" />;
    if (t.includes('databricks')) return <DatabricksIcon className="w-4 h-4 text-red-500" />;
    if (t.includes('hadoop') || t.includes('hive')) return <HadoopElephant className="w-4 h-4 text-yellow-500" />;
    if (t.includes('snowflake')) return <SnowflakeIcon className="w-4 h-4 text-blue-400" />;
    if (t.includes('kafka') || t.includes('confluent')) return <KafkaIcon className="w-4 h-4 text-slate-800" />;
    if (t.includes('parquet') || t.includes('avro') || t.includes('csv')) return <ParquetIcon className="w-4 h-4 text-emerald-500" />;
    
    if (t.includes('python') || t.includes('pandas')) return <PythonIcon className="w-4 h-4 text-yellow-400" />;
    if (t.includes('java') || t.includes('spring')) return <JavaIcon className="w-4 h-4 text-red-400" />;
    if (t.includes('react') || t.includes('vue') || t.includes('angular') || t.includes('node')) return <Code className="w-4 h-4 text-cyan-400" />;
    
    if (t.includes('oracle')) return <Database className="w-4 h-4 text-red-600" fill="currentColor" />;
    if (t.includes('postgres') || t.includes('db2')) return <Database className="w-4 h-4 text-blue-600" fill="currentColor" />;
    if (t.includes('sql') || t.includes('mysql')) return <Database className="w-4 h-4 text-blue-400" />;
    if (t.includes('mongo') || t.includes('dynamo')) return <HardDrive className="w-4 h-4 text-green-500" />;
    if (t.includes('redis') || t.includes('cache')) return <Layers className="w-4 h-4 text-red-400" />;
    if (t.includes('s3') || t.includes('blob')) return <Archive className="w-4 h-4 text-yellow-600" />;

    if (t.includes('aws') || t.includes('cloud')) return <CloudCustomIcon className="w-4 h-4 text-orange-400" />;
    if (t.includes('docker') || t.includes('k8s') || t.includes('kubernetes')) return <DockerIcon className="w-4 h-4 text-blue-500" />;
    if (t.includes('airflow') || t.includes('dag')) return <Workflow className="w-4 h-4 text-teal-400" />;
    
    if (t.includes('ml') || t.includes('ai') || t.includes('model') || t.includes('gpt')) return <Cpu className="w-4 h-4 text-purple-500" />;

    return null;
};