import { z } from 'zod';

const nodeDataSchema = z.object({
  label: z.string().optional(),
  variant: z.string().optional(),
  technology: z.string().optional(),
  diagramType: z.string().optional(),
  isTransparent: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  expandedWidth: z.number().optional(),
  expandedHeight: z.number().optional(),
  isSketchMode: z.boolean().optional(),
  isPreviewMode: z.boolean().optional(),
  diffStatus: z.string().optional()
}).catchall(z.any());

export const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: nodeDataSchema,
  style: z.record(z.any()).optional(),
  className: z.string().optional(),
  parentNode: z.string().optional(),
  zIndex: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  positionAbsolute: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  dragging: z.boolean().optional(),
  hidden: z.boolean().optional()
}).catchall(z.any());

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  data: z.record(z.any()).optional(),
  style: z.record(z.any()).optional(),
  markerEnd: z.any().optional()
}).catchall(z.any());

export const viewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number()
});

export const diagramStateSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema).optional(),
  layoutDirection: z.enum(['TB', 'LR']).optional(),
  currentDiagramType: z.string().optional(),
  timestamp: z.number().optional(),
  viewport: viewportSchema.optional(),
  title: z.string().optional()
});
