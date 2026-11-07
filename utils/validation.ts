import DOMPurify from 'dompurify';
import { Node, Edge } from 'reactflow';
import { DiagramType } from '../types';

/**
 * Strips prototype pollution properties from an object recursively.
 * Using Object.prototype.hasOwnProperty.call to check own properties safely.
 */
function sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }

            const value = obj[key];
            if (typeof value === 'string') {
                // Sanitize strings to prevent XSS
                sanitized[key] = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }); // Strip all HTML
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
    }
    return sanitized;
}

/**
 * Validates the imported diagram state to prevent manipulation and injection attacks.
 */
export function validateDiagramState(data: any): { nodes?: Node[], edges?: Edge[], currentDiagramType?: DiagramType, layoutDirection?: string, viewport?: any } | null {
    if (!data || typeof data !== 'object') {
        return null;
    }

    // Clone and sanitize the entire object to strip dangerous keys and sanitize strings
    const sanitizedData = sanitizeObject(data);

    // Structural validation
    const isValidNodes = Array.isArray(sanitizedData.nodes);
    const isValidEdges = sanitizedData.edges === undefined || Array.isArray(sanitizedData.edges);

    if (!isValidNodes || !isValidEdges) {
        return null;
    }

    // Ensure nodes have basic properties required by ReactFlow (id, position)
    for(const node of sanitizedData.nodes) {
        if (!node.id || typeof node.id !== 'string') return null;
        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') return null;
    }

    // Ensure edges have basic properties (id, source, target)
    if (sanitizedData.edges) {
        for(const edge of sanitizedData.edges) {
            if (!edge.id || typeof edge.id !== 'string') return null;
            if (!edge.source || typeof edge.source !== 'string') return null;
            if (!edge.target || typeof edge.target !== 'string') return null;
        }
    }

    return sanitizedData;
}
