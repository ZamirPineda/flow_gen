import { z } from 'zod';

export const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: z.record(z.any()).optional(),
  style: z.record(z.any()).optional(),
  className: z.string().optional(),
  isHidden: z.boolean().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  draggable: z.boolean().optional(),
  selectable: z.boolean().optional(),
  connectable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  dragHandle: z.string().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  parentNode: z.string().optional(),
  zIndex: z.number().optional(),
  extent: z.union([z.literal('parent'), z.any()]).optional(),
  expandParent: z.boolean().optional(),
  positionAbsolute: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  sourcePosition: z.string().optional(),
  targetPosition: z.string().optional(),
}).passthrough();

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  data: z.record(z.any()).optional(),
  animated: z.boolean().optional(),
}).passthrough();

export const diagramStateSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema).optional(),
  layoutDirection: z.string().optional(),
  currentDiagramType: z.string().optional(),
  timestamp: z.number().optional(),
  title: z.string().optional(), // For imports
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number()
  }).optional()
}).passthrough();
