
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Database, Loader2, Upload, Trash2, RefreshCw, Settings2, ArrowDown, ArrowRight, Zap, Server, Radio, Layers, Cloud, Code2, Container, Workflow, Eye, Table2, Shapes, GitFork, BrainCircuit, ShieldCheck, Edit3, X, Save, Box, Lock, Type, ImagePlus, Camera, Activity, History, Mic, MicOff, LayoutTemplate, Grid, Command, ShieldAlert, FileCode, PanelLeftClose, PanelLeftOpen, Plus, Battery, BatteryCharging, PenTool, DollarSign, Globe, Clock, RotateCcw } from 'lucide-react';
import { DiagramType, ViewMode, NodeData } from '../types';
import { Node } from 'reactflow';
import { getTechIcon } from './TechIcons';

// --- PREDEFINED OPTIONS ---

const TECH_GROUPS = {
    "Languages": ["TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "C#", "C++", "PHP", "Ruby", "Swift", "Kotlin", "Scala"],
    "Frontend & Mobile": ["React", "Next.js", "Vue.js", "Angular", "Svelte", "React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)", "Tailwind"],
    "Backend Frameworks": ["Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", ".NET Core", "Laravel", "Ruby on Rails", "Gin", "Fiber"],
    "Databases": ["Postgres", "MySQL", "Oracle", "SQL Server", "MongoDB", "DynamoDB", "Cassandra", "Redis", "Elasticsearch", "Neo4j", "CockroachDB", "Firestore", "ScyllaDB", "HBase", "TiDB"],
    "Big Data Compute": ["Spark", "Flink", "Beam", "Storm", "Samza", "Databricks", "EMR", "Presto", "Trino", "Druid", "Pinot"],
    "Big Data Storage": ["HDFS", "MinIO", "Ceph", "Ozone", "Delta Lake", "Iceberg", "Hudi", "Snowflake", "BigQuery", "Redshift"],
    "Distributed Systems": ["Ray", "Dask", "Akka", "Erlang/OTP", "Zookeeper", "Etcd", "Consul"],
    "Messaging & Streaming": ["Kafka", "RabbitMQ", "Pulsar", "Kinesis", "SNS", "SQS", "ActiveMQ", "NATS", "Google Pub/Sub", "Azure Service Bus"],
    "Cloud & Infrastructure": ["AWS", "Google Cloud", "Azure", "Terraform", "Ansible", "Pulumi", "CloudFormation", "Docker", "Kubernetes", "Helm", "Istio"],
    "Serverless & Compute": ["AWS Lambda", "Azure Functions", "Google Cloud Functions", "Cloud Run", "Fargate", "ECS", "EKS", "App Engine", "Vercel", "Netlify"],
    "Networking & Security": ["Nginx", "Apache", "Traefik", "Cloudflare", "AWS ALB", "API Gateway", "Kong", "Keycloak", "Auth0", "Okta", "VPN", "WAF"],
    "Observability & Orch": ["Prometheus", "Grafana", "Datadog", "New Relic", "Splunk", "Jaeger", "OpenTelemetry", "Airflow", "Prefect", "Dagster", "Luigi"],
    "AI & ML": ["PyTorch", "TensorFlow", "OpenAI", "Bedrock", "HuggingFace", "LangChain", "Scikit-learn", "MLflow", "SageMaker", "Vertex AI"],
};

const STAGE_OPTIONS = [
    // Data Lifecycle
    "Source / Ingestion",
    "Raw Landing",
    "Bronze (Raw)",
    "Schema Validation",
    "Silver (Cleansed)",
    "Data Enrichment",
    "Gold (Aggregated)",
    "Platinum (Served)",
    "Data Partitioning",
    "Compaction",
    "Archive / Cold",
    // Governance
    "Data Quality Check",
    "Data Cataloging",
    "Access Control Policy",
    // Software Layers
    "Presentation Layer",
    "API Layer",
    "Business Logic",
    "Data Access",
    "Infrastructure",
    "Security / Auth",
    "Edge / CDN",
    // DevOps Pipeline
    "Code Commit",
    "Code Review",
    "Linting & Static Analysis",
    "Unit Tests",
    "Integration Tests",
    "Security Scan (SAST/DAST)",
    "Build Artifact",
    "Container Registry",
    "Dev Deployment",
    "Staging Deployment",
    "Prod Deployment",
    "Canary Release",
    "Blue/Green Switch",
    "Rollback",
    "Monitoring & Alerting",
    // MLOps
    "Data Prep",
    "Feature Store",
    "Model Training",
    "Model Evaluation",
    "Model Serving"
];



interface SidebarProps {
    onReset: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewModeChange: (mode: ViewMode) => void;
    onUpdateNode: (id: string, data: Partial<NodeData>) => void;
    onDeleteNode: (id: string) => void;
    onShowHistory: () => void;
    selectedNode: Node<NodeData> | null;
    currentViewMode: ViewMode;
    onAddNode: () => void;
    hasData: boolean;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    isReadOnly?: boolean;
    onToast?: (title: string, msg: string, type: 'info' | 'error') => void;
    isLowPowerMode: boolean;
    onToggleLowPowerMode: () => void;
    isSketchMode: boolean;
    onToggleSketchMode: () => void;
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    onReset,
    onImport,
    onViewModeChange,
    onUpdateNode,
    onDeleteNode,
    onShowHistory,
    selectedNode,
    currentViewMode,
    onAddNode,
    hasData,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    isReadOnly = false,
    onToast,
    isLowPowerMode,
    onToggleLowPowerMode,
    isSketchMode,
    onToggleSketchMode,
    currentLanguage,
    onLanguageChange
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editForm, setEditForm] = useState<NodeData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            }
        };

        if (window.innerWidth < 1024) {
            setIsCollapsed(true);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (selectedNode) {
            if (isCollapsed) setIsCollapsed(false);
            setEditForm({ ...selectedNode.data });
        } else {
            setEditForm(null);
        }
    }, [selectedNode]);

    const handleLocalReset = () => {
        if (isReadOnly) return;
        onReset();
    };

    const handleEditChange = (field: keyof NodeData, value: string) => {
        if (!editForm || !selectedNode || isReadOnly) return;

        const newData = { ...editForm, [field]: value };
        setEditForm(newData);
        // Live Update
        onUpdateNode(selectedNode.id, { [field]: value });
    };

    const typeIcons = {
        [DiagramType.DATA_ENGINEERING]: <Database className="w-4 h-4" />,
        [DiagramType.MESSAGING]: <Radio className="w-4 h-4" />,
        [DiagramType.C4_MODEL]: <Layers className="w-4 h-4" />,
        [DiagramType.CLOUD_ARCH]: <Cloud className="w-4 h-4" />,
        [DiagramType.BACKEND_DESIGN]: <Code2 className="w-4 h-4" />,
        [DiagramType.DEVOPS]: <Container className="w-4 h-4" />,
        [DiagramType.SYSTEM_PIPELINES]: <Workflow className="w-4 h-4" />,
        [DiagramType.DATABASE_MODELING]: <Table2 className="w-4 h-4" />,
        [DiagramType.UML]: <Shapes className="w-4 h-4" />,
        [DiagramType.SECURITY]: <ShieldCheck className="w-4 h-4" />
    };

    // Available Node Variants for Dropdown
    const NODE_VARIANTS = [
        'service', 'database', 'client', 'queue', 'cloud', 'security', 'ai',
        'file', 'table', 'api', 'function', 'container',
        'mobile', 'browser', 'iot', 'router', 'load_balancer', 'dashboard', 'gateway', 'firewall',
        'registry', 'cdn', 'dns', 'vpn', 'alert', 'log',
        'cluster', 'job', 'lake', 'warehouse', 'stream', 'machine'
    ];

    // --- RENDER: TITLE EDIT MODE ---
    if (selectedNode && selectedNode.type === 'title' && editForm) {
        return (
            <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 animate-in slide-in-from-left-4 duration-200">
                <div className="p-5 border-b border-slate-800 bg-indigo-900/10">
                    <div className="flex items-center gap-2 mb-1">
                        <Type className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                            Edit Diagram Title
                        </h2>
                        <button onClick={() => setEditForm(null)} className="ml-auto text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex-1 p-5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                        Title Text
                    </label>
                    <textarea
                        value={editForm.label}
                        onChange={(e) => handleEditChange('label', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full h-32 bg-slate-800 border border-slate-700 rounded-md p-3 text-sm text-slate-200 outline-none resize-none leading-relaxed ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500'}`}
                        placeholder="Enter diagram title..."
                    />
                </div>
            </div>
        );
    }

    // --- RENDER: EDIT MODE (DETAILS) ---
    if (selectedNode && editForm) {
        return (
            <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 animate-in slide-in-from-left-4 duration-200">
                <div className={`p-5 border-b border-slate-800 ${isReadOnly ? 'bg-amber-900/10' : 'bg-indigo-900/10'}`}>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            {isReadOnly ? <Eye className="w-4 h-4 text-amber-400" /> : <Edit3 className="w-4 h-4 text-indigo-400" />}
                            <h2 className={`text-sm font-bold uppercase tracking-wider ${isReadOnly ? 'text-amber-100' : 'text-slate-100'}`}>
                                {isReadOnly ? 'Component Details' : 'Edit Node'}
                            </h2>
                        </div>
                        {isReadOnly && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Read Only</span>}
                        <button onClick={() => setEditForm(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {selectedNode.id}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Label */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Label / Name</label>
                        <input
                            type="text"
                            value={editForm.label}
                            onChange={(e) => handleEditChange('label', e.target.value)}
                            disabled={isReadOnly}
                            className={`w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-200 outline-none ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500'}`}
                        />
                    </div>

                    {/* Variant / Type */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Component Type</label>
                        <div className={`grid grid-cols-2 gap-2 ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                            {NODE_VARIANTS.map(v => (
                                <button
                                    key={v}
                                    onClick={() => handleEditChange('variant', v)}
                                    disabled={isReadOnly}
                                    className={`text-[10px] py-1.5 px-2 rounded border capitalize text-left transition-all truncate ${editForm.variant === v
                                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                    title={v}
                                >
                                    {v.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Technology (Dropdown) */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Technology</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <select
                                    value={editForm.technology || ''}
                                    onChange={(e) => handleEditChange('technology', e.target.value)}
                                    disabled={isReadOnly}
                                    className={`w-full bg-slate-800 border border-slate-700 rounded-md p-2 pl-8 text-sm text-slate-200 outline-none appearance-none cursor-pointer ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500'}`}
                                >
                                    <option value="">Select Technology...</option>
                                    {Object.entries(TECH_GROUPS).map(([group, techs]) => (
                                        <optgroup key={group} label={group} className="bg-slate-900 text-slate-400">
                                            {techs.map(tech => (
                                                <option key={tech} value={tech} className="text-slate-200">{tech}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <div className="absolute left-2.5 top-2.5 pointer-events-none">
                                    {getTechIcon(editForm.technology) || <Settings2 className="w-4 h-4 text-slate-500" />}
                                </div>
                                <div className="absolute right-2 top-2.5 pointer-events-none text-slate-500">
                                    <ArrowDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stage (Dropdown) */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Pipeline Stage</label>
                        <div className="relative">
                            <select
                                value={editForm.stage || ''}
                                onChange={(e) => handleEditChange('stage', e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-200 outline-none appearance-none cursor-pointer ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500'}`}
                            >
                                <option value="">Select Stage...</option>
                                {STAGE_OPTIONS.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-2.5 pointer-events-none text-slate-500">
                                <ArrowDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Technical Details</label>
                        <textarea
                            value={editForm.details || ''}
                            onChange={(e) => handleEditChange('details', e.target.value)}
                            disabled={isReadOnly}
                            className={`w-full h-32 bg-slate-800 border border-slate-700 rounded-md p-2 text-xs text-slate-300 outline-none resize-none leading-relaxed ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500'}`}
                            placeholder="Add metrics, schema details, or config..."
                        />
                    </div>

                    {!isReadOnly && (
                        <div className="pt-4 border-t border-slate-800">
                            <button
                                onClick={() => onDeleteNode(selectedNode.id)}
                                className="w-full flex items-center justify-center gap-2 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md transition-colors text-xs font-bold"
                            >
                                <Trash2 className="w-3 h-3" />
                                Delete Node
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
                    <p className="text-[10px] text-slate-500 italic">
                        {isReadOnly ? "Switch to Edit Mode to modify" : "Changes apply immediately"}
                    </p>
                </div>
            </div>
        );
    }

    // --- COLLAPSED MINI-VIEW ---
    const renderCollapsedView = () => (
        <div className="flex flex-col items-center py-4 space-y-6 animate-in fade-in duration-300">
            {/* Top Logo */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Server className="text-white w-6 h-6" />
            </div>

            <div className="w-8 h-px bg-slate-700/50"></div>

            {/* Icon Toolbar */}
            <div className="flex flex-col gap-3">
                <button onClick={handleLocalReset} className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors" title="New Diagram">
                    <Plus className="w-5 h-5" />
                </button>

                <button onClick={onShowHistory} className="p-2.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors" title="History">
                    <History className="w-5 h-5" />
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                    title="Import JSON"
                >
                    <Upload className="w-5 h-5" />
                </button>

                <button onClick={onToggleLowPowerMode} className={`p-2.5 rounded-lg hover:bg-slate-800 transition-colors ${isLowPowerMode ? 'text-amber-400' : 'text-slate-400'}`} title="Performance Mode">
                    {isLowPowerMode ? <Battery className="w-5 h-5" /> : <BatteryCharging className="w-5 h-5" />}
                </button>

                <button onClick={onToggleSketchMode} className={`p-2.5 rounded-lg hover:bg-slate-800 transition-colors ${isSketchMode ? 'text-teal-400' : 'text-slate-400'}`} title="Sketch Mode">
                    <PenTool className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1"></div>

            <div className="vertical-text text-[10px] uppercase font-bold text-slate-600 tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                FlowGen AI v5
            </div>
        </div>
    );

    // --- RENDER: STUDIO MODE (Main) ---
    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-80'} h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-10 transition-all duration-300 relative`}>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-slate-800 border border-slate-600 text-slate-400 rounded-full p-1 shadow-md hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all z-50"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
            </button>

            {/* COLLAPSED CONTENT */}
            {isCollapsed && renderCollapsedView()}

            {/* EXPANDED CONTENT (Hidden when collapsed) */}
            <div className={`flex flex-col h-full w-full ${isCollapsed ? 'hidden opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                <div className="p-5 border-b border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Server className="text-white w-5 h-5" />
                            </div>
                            <div className="overflow-hidden whitespace-nowrap">
                                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 leading-tight">
                                    FlowGen AI
                                </h1>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-500 font-mono">v5.0</span>
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] text-slate-500 font-medium">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Minimal Actions */}
                        <div className="flex gap-1">
                            <button
                                onClick={onShowHistory}
                                className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                                title="History"
                            >
                                <History className="w-4 h-4" />
                            </button>
                        </div>
                    </div>


                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* READ ONLY BANNER */}
                    {isReadOnly && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-full">
                                <Lock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-amber-300">Presentation Mode</h3>
                                <p className="text-[10px] text-amber-200/70">Editing and generation disabled</p>
                            </div>
                        </div>
                    )}

                    {hasData && (
                        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View Perspective
                            </label>
                            <div className="flex gap-1 mb-4">
                                {Object.values(ViewMode).map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => onViewModeChange(mode)}
                                        disabled={isReadOnly}
                                        className={`flex-1 py-1.5 text-[10px] rounded transition-all ${currentViewMode === mode
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Manual Architecting
                        </label>
                        <button
                            onClick={onAddNode}
                            disabled={isReadOnly}
                            className={`w-full py-2.5 rounded-md border flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg ${isReadOnly ? 'border-indigo-900/50 bg-indigo-900/20 text-indigo-500/50 cursor-not-allowed' : 'border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02]'}`}
                            title="Add a new component to the canvas"
                        >
                            <Plus className="w-4 h-4" /> Add Component
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2 justify-center">
                        {/* LOW POWER TOGGLE */}
                        <button
                            onClick={onToggleLowPowerMode}
                            className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-xs transition-colors ${isLowPowerMode
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                                : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:text-indigo-300 hover:border-indigo-500/30'
                                }`}
                            title="Toggle Low Power / Performance Mode"
                        >
                            {isLowPowerMode ? <Battery className="w-3.5 h-3.5" /> : <BatteryCharging className="w-3.5 h-3.5" />}
                        </button>

                        {/* SKETCH MODE TOGGLE */}
                        <button
                            onClick={onToggleSketchMode}
                            className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-xs transition-colors ${isSketchMode
                                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20'
                                : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:text-teal-300 hover:border-teal-500/30'
                                }`}
                            title="Toggle Hand-drawn Sketch Mode"
                        >
                            <PenTool className="w-3.5 h-3.5" />
                            {isSketchMode ? 'Sketch' : 'Iso'}
                        </button>

                        <button
                            onClick={handleLocalReset}
                            disabled={isReadOnly}
                            className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-xs transition-colors ${isReadOnly ? 'border-slate-800 text-slate-600 cursor-not-allowed' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'}`}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-600">
                        FlowGen Architect
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
