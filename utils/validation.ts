import DOMPurify from 'dompurify';

export const validateDiagramState = (flowData: any): any => {
    // Basic validation
    if (!flowData || typeof flowData !== 'object') {
        throw new Error('Invalid diagram state format');
    }

    // Strip prototype properties to mitigate Prototype Pollution
    const sanitizeObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }

        const cleanObj: any = {};
        for (const key in obj) {
            // Mitigate prototype pollution by skipping special keys
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively sanitize nested objects
                cleanObj[key] = sanitizeObject(obj[key]);
            } else {
                // Keep primitive values (numbers, booleans, strings) as is.
                // We rely on React's native string escaping when rendering unless dangerouslySetInnerHTML is explicitly used.
                // Memory indicates: Do not use DOMPurify to sanitize raw Markdown prior to parsing it into React components.
                // We will specifically sanitize ONLY node.data.label to prevent XSS attacks based on memory rules.
                if (key === 'label' && typeof obj[key] === 'string' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
                    cleanObj[key] = DOMPurify.sanitize(obj[key]);
                } else {
                    cleanObj[key] = obj[key];
                }
            }
        }
        return cleanObj;
    };

    // Sanitize the entire flow data structure
    const sanitizedData = sanitizeObject(flowData);

    // Legacy support: default missing edges array to empty array
    if (!sanitizedData.edges) {
        sanitizedData.edges = [];
    }

    // Ensure nodes is an array
    if (!sanitizedData.nodes || !Array.isArray(sanitizedData.nodes)) {
        sanitizedData.nodes = [];
    }

    return sanitizedData;
};
