import { z } from 'zod';
import { DiagramType } from '../types';

export const NodeDataSchema = z.object({
  label: z.string().default(''),
  variant: z.string().optional(),
  technology: z.string().optional(),
  diagramType: z.nativeEnum(DiagramType).optional(),
  details: z.string().optional(),
  stage: z.string().optional(),
  isTransparent: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  expandedWidth: z.number().optional(),
  expandedHeight: z.number().optional(),
  isSketchMode: z.boolean().optional(),
  isPreviewMode: z.boolean().optional(),
  diffStatus: z.enum(['added', 'removed', 'modified']).optional(),
}).catchall(z.unknown());

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: NodeDataSchema,
  parentNode: z.string().optional(),
}).catchall(z.unknown());

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  data: z.object({
      color: z.string().optional(),
      diagramType: z.nativeEnum(DiagramType).optional(),
      pathType: z.string().optional()
  }).catchall(z.unknown()).optional()
}).catchall(z.unknown());

export const ViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number()
});

export const FlowStateSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema).optional(),
  layoutDirection: z.enum(['TB', 'LR']).optional(),
  currentDiagramType: z.nativeEnum(DiagramType).optional(),
  timestamp: z.number().optional(),
  viewport: ViewportSchema.optional()
}).catchall(z.unknown());
