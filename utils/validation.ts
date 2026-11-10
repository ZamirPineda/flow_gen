import DOMPurify from 'dompurify';

/**
 * Strips prototype pollution properties from an object recursively.
 */
function sanitizePrototype(obj: any) {
    if (obj == null || typeof obj !== 'object') {
        return;
    }

    // Arrays
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            sanitizePrototype(obj[i]);
        }
        return;
    }

    // Objects
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                delete obj[key];
            } else {
                sanitizePrototype(obj[key]);
            }
        }
    }
}

/**
 * Sanitizes specific node data fields to prevent XSS.
 */
function sanitizeNodeData(node: any) {
    if (!node || !node.data) return;

    if (typeof node.data.label === 'string') {
        node.data.label = DOMPurify.sanitize(node.data.label);
    }
    if (typeof node.data.details === 'string') {
        node.data.details = DOMPurify.sanitize(node.data.details);
    }
    // Add other fields as necessary. For now, label and details are the primary XSS vectors.
}

/**
 * Validates and sanitizes imported flow data or local storage state.
 * Throws an error if the schema is fundamentally invalid.
 */
export function validateDiagramState(flowData: any): { nodes: any[], edges: any[], [key: string]: any } {
    if (!flowData || typeof flowData !== 'object') {
        throw new Error('Invalid diagram state: must be an object.');
    }

    if (!Array.isArray(flowData.nodes)) {
        throw new Error('Invalid diagram state: missing nodes array.');
    }

    if (!Array.isArray(flowData.edges)) {
        flowData.edges = [];
    }

    // Clone the data to avoid mutating original objects if passed by reference somewhere,
    // though typically it's freshly parsed from JSON.
    const sanitizedData = JSON.parse(JSON.stringify(flowData));

    // Strip Prototype Pollution vectors
    sanitizePrototype(sanitizedData);

    // Sanitize Node Data for XSS
    for (const node of sanitizedData.nodes) {
        if (typeof node === 'object' && node !== null) {
            sanitizeNodeData(node);
        }
    }

    return sanitizedData;
}
