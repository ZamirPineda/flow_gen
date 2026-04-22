import { DiagramType } from '../types';
import { THEME } from '../theme';

export const getNodeColor = (type: DiagramType | undefined, variant: string = 'default', label: string = ''): string => {
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

    // 5. DIAGRAM MODELS
    if (type === 'system_pipelines' as any) {
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
