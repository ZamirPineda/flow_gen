import { z } from 'zod';
import { DiagramType } from '../types';

// Strict schema validation for React Flow Nodes and Edges to prevent Prototype Pollution
// and ensure secure deserialization.

const NodeDataSchema = z.object({
    label: z.string().default(''),
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
    diffStatus: z.enum(['added', 'removed', 'modified', 'unchanged']).optional(),
}).catchall(z.unknown()); // Allow unknown fields from external plugins/react-flow but validate the known ones safely

const NodeStyleSchema = z.object({
    width: z.union([z.number(), z.string()]).optional(),
    height: z.union([z.number(), z.string()]).optional(),
}).catchall(z.unknown());

export const FlowNodeSchema = z.object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: NodeDataSchema,
    style: NodeStyleSchema.optional(),
    parentNode: z.string().optional(),
    extent: z.union([z.literal('parent'), z.unknown()]).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional(),
    draggable: z.boolean().optional(),
    selectable: z.boolean().optional(),
    connectable: z.boolean().optional(),
    hidden: z.boolean().optional(),
    zIndex: z.number().optional(),
}).catchall(z.unknown()); // Allow React Flow internal properties

export const FlowEdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional().nullable(),
    targetHandle: z.string().optional().nullable(),
    type: z.string().optional(),
    animated: z.boolean().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    style: z.record(z.string(), z.unknown()).optional(),
}).catchall(z.unknown());

export const DiagramStateSchema = z.object({
    nodes: z.array(FlowNodeSchema).default([]),
    edges: z.array(FlowEdgeSchema).default([]),
    layoutDirection: z.enum(['TB', 'LR']).optional(),
    currentDiagramType: z.nativeEnum(DiagramType).optional(),
    timestamp: z.number().optional(),
    viewport: z.object({
        x: z.number(),
        y: z.number(),
        zoom: z.number()
    }).optional(),
}).catchall(z.unknown()); // Allow extra fields like 'title' in exports
