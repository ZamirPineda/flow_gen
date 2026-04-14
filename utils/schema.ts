import { z } from 'zod';
import { DiagramType } from '../types';

export const nodeDataSchema = z.object({
  label: z.string(),
  type: z.enum(['input', 'default', 'output']).optional(),
  details: z.string().optional(),
  variant: z.string().optional(),
  technology: z.string().optional(),
  stage: z.string().optional(),
  diagramType: z.nativeEnum(DiagramType).optional(),
  groupId: z.string().optional(),
  maxHeight: z.number().optional(),
  activationStart: z.number().optional(),
  activationEnd: z.number().optional(),
  collapsed: z.boolean().optional(),
  expandedWidth: z.number().optional(),
  expandedHeight: z.number().optional(),
  isTransparent: z.boolean().optional(),
  isSketchMode: z.boolean().optional(),
  isPreviewMode: z.boolean().optional(),
  diffStatus: z.enum(['added', 'removed', 'modified', 'unchanged']).optional()
}).catchall(z.unknown());

export const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: nodeDataSchema,
  style: z.any().optional(),
  className: z.string().optional(),
  sourcePosition: z.any().optional(),
  targetPosition: z.any().optional(),
  hidden: z.boolean().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  draggable: z.boolean().optional(),
  selectable: z.boolean().optional(),
  connectable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  dragHandle: z.string().optional(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  parentNode: z.string().optional(),
  zIndex: z.number().optional(),
  extent: z.union([z.enum(['parent']), z.any()]).optional(),
  expandParent: z.boolean().optional(),
  ariaLabel: z.string().optional(),
  focusable: z.boolean().optional(),
}).catchall(z.unknown());

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
  label: z.union([z.string(), z.any()]).optional(),
  style: z.any().optional(),
  animated: z.boolean().optional(),
  hidden: z.boolean().optional(),
  deletable: z.boolean().optional(),
  className: z.string().optional(),
  data: z.any().optional(),
  markerStart: z.any().optional(),
  markerEnd: z.any().optional(),
  zIndex: z.number().optional(),
  ariaLabel: z.string().optional(),
  focusable: z.boolean().optional(),
  interactionWidth: z.number().optional(),
  selected: z.boolean().optional(),
}).catchall(z.unknown());

export const flowStateSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  layoutDirection: z.enum(['TB', 'LR']).optional(),
  currentDiagramType: z.nativeEnum(DiagramType).optional(),
  timestamp: z.number().optional(),
  title: z.string().optional(),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number()
  }).optional()
}).catchall(z.unknown());
