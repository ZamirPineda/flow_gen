import { z } from 'zod';
import { DiagramType } from '../types';

// Enum validations based on types.ts
const NodeVariantSchema = z.enum([
  'service', 'database', 'client', 'queue', 'cloud', 'security', 'table', 'lifeline',
  'ai', 'file', 'group', 'api', 'function', 'container', 'mobile', 'browser', 'iot',
  'router', 'load_balancer', 'dashboard', 'gateway', 'firewall', 'registry', 'cdn',
  'dns', 'vpn', 'alert', 'log', 'cluster', 'job', 'lake', 'warehouse', 'stream', 'machine'
]);

const DiagramTypeSchema = z.nativeEnum(DiagramType);

const DiffStatusSchema = z.enum(['added', 'removed', 'modified', 'unchanged']);

// Schema for NodeData
export const NodeDataSchema = z.object({
  label: z.string().default(''),
  type: z.enum(['input', 'default', 'output']).optional(),
  details: z.string().optional(),
  variant: NodeVariantSchema.optional(),
  technology: z.string().optional(),
  stage: z.string().optional(),
  diagramType: DiagramTypeSchema.optional(),
  groupId: z.string().optional(),

  // Sequence Diagrams
  maxHeight: z.number().optional(),
  activationStart: z.number().optional(),
  activationEnd: z.number().optional(),

  // Groups
  collapsed: z.boolean().optional(),
  expandedWidth: z.number().optional(),
  expandedHeight: z.number().optional(),

  // Clean View
  isTransparent: z.boolean().optional(),

  // Visual Modes
  isSketchMode: z.boolean().optional(),
  isPreviewMode: z.boolean().optional(),

  // Version Comparison
  diffStatus: DiffStatusSchema.optional(),
}).passthrough(); // Allow unknown keys to pass through for flexibility

// Minimal validation for React Flow structures
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: NodeDataSchema,
  parentNode: z.string().optional(),
  extent: z.enum(['parent']).optional(),
  zIndex: z.number().optional(),
  style: z.record(z.any()).optional(),
  hidden: z.boolean().optional(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  draggable: z.boolean().optional(),
  selectable: z.boolean().optional(),
  connectable: z.boolean().optional(),
  resizing: z.boolean().optional(),
  measured: z.record(z.any()).optional(),
  sourcePosition: z.string().optional(),
  targetPosition: z.string().optional(),
}).passthrough();

export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  label: z.string().optional(),
  animated: z.boolean().optional(),
  hidden: z.boolean().optional(),
  data: z.record(z.any()).optional(),
  style: z.record(z.any()).optional(),
  markerEnd: z.any().optional(),
  markerStart: z.any().optional(),
  selected: z.boolean().optional(),
}).passthrough();

export const SavedFlowStateSchema = z.object({
  nodes: z.array(FlowNodeSchema).default([]),
  edges: z.array(FlowEdgeSchema).default([]),
  layoutDirection: z.enum(['TB', 'LR']).optional(),
  currentDiagramType: DiagramTypeSchema.optional(),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number()
  }).optional(),
  timestamp: z.number().optional()
}).passthrough();

export const ImportedFlowStateSchema = SavedFlowStateSchema.extend({
  title: z.string().optional()
});
