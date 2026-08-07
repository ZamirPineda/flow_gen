/**
 * Recursively sanitizes an object by removing prototype pollution vectors.
 */
function sanitizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Strip prototype pollution properties
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }
            sanitized[key] = sanitizeObject(obj[key]);
        }
    }
    return sanitized;
}

/**
 * Validates and sanitizes imported diagram state to prevent Prototype Pollution
 * and ensure schema integrity.
 */
export function validateDiagramState(parsedData: any): any {
    if (!parsedData || typeof parsedData !== 'object') {
        throw new Error("Invalid format: Expected an object.");
    }

    const sanitizedData = sanitizeObject(parsedData);

    // Basic schema validation
    if (!Array.isArray(sanitizedData.nodes) || !Array.isArray(sanitizedData.edges)) {
        throw new Error("Invalid schema: 'nodes' and 'edges' must be arrays.");
    }

    return sanitizedData;
}
