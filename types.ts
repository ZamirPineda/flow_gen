

export type NodeVariant = 'service' | 'database' | 'client' | 'queue' | 'cloud' | 'security' | 'table' | 'lifeline' | 'ai' | 'file' | 'group' | 'api' | 'function' | 'container' | 'mobile' | 'browser' | 'iot' | 'router' | 'load_balancer' | 'dashboard' | 'gateway' | 'firewall' | 'registry' | 'cdn' | 'dns' | 'vpn' | 'alert' | 'log' | 'cluster' | 'job' | 'lake' | 'warehouse' | 'stream' | 'machine';

export enum ViewMode {
  ARCHITECTURE = 'Architecture',
  DATA_FLOW = 'Data Flow',
  PROCESS = 'Process'
}

export interface AuditIssue {
  id: string;
  nodeId: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
  remediation: string;
}

export type DiffStatus = 'added' | 'removed' | 'modified' | 'unchanged';

export interface NodeData {
  label: string;
  type?: 'input' | 'default' | 'output';
  details?: string;
  variant?: NodeVariant;
  technology?: string; // e.g. "React", "Postgres", "AWS Lambda", "Spark", "Kafka"
  stage?: string; // e.g. "Ingestion", "Silver Layer", "Gold Layer"
  diagramType?: DiagramType; // Context for styling (Hexagonal vs Standard)
  groupId?: string; // The ID of the parent group this node belongs to

  // For Sequence Diagrams
  maxHeight?: number;
  activationStart?: number; // Step number where activation begins
  activationEnd?: number;   // Step number where activation ends

  // For Collapsible Groups
  collapsed?: boolean;
  expandedWidth?: number;
  expandedHeight?: number;

  // For Clean View (Hide Group Borders)
  isTransparent?: boolean;

  // Visual Modes
  isSketchMode?: boolean; // For Hand-drawn style
  isPreviewMode?: boolean; // For presentation 3D view

  // Version Comparison
  diffStatus?: DiffStatus; // For Visual Diff Mode
}

export enum DiagramType {
  DATA_ENGINEERING = 'Data Engineering',
  MESSAGING = 'Messaging & Streaming',
  C4_MODEL = 'C4 Model',
  CLOUD_ARCH = 'Cloud Architecture',
  BACKEND_DESIGN = 'Backend Design',
  DEVOPS = 'DevOps / Infra',
  SYSTEM_PIPELINES = 'System Pipelines',
  DATABASE_MODELING = 'Database Modeling',
  UML = 'UML Diagrams',
  BPMN = 'Business Process (BPMN)',
  SECURITY = 'Security Architecture'
}

export type CodeLanguage = 'terraform' | 'python' | 'kubernetes' | 'docker';

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'code' | 'explanation' | 'strategy' | 'audit' | 'cost';
  title: string;
  content: string; // The raw code or markdown explanation
  language?: string; // Only for 'code' type
  // Snapshot data for diffing
  graphSnapshot?: {
    nodes: any[];
    edges: any[];
  };
}

// --- TOAST TYPES ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
