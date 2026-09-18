export const validateDiagramState = (data: any): boolean => {
    try {
        if (!data || typeof data !== 'object') return false;

        // Ensure nodes array exists
        if (!Array.isArray(data.nodes)) return false;

        // Ensure edges array exists
        if (!Array.isArray(data.edges)) return false;

        // Ensure each node has an id
        for (const node of data.nodes) {
            if (!node.id || typeof node.id !== 'string') return false;
            if (!node.position || typeof node.position !== 'object' || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') return false;
        }

        // Ensure each edge has an id, source, and target
        for (const edge of data.edges) {
            if (!edge.id || typeof edge.id !== 'string') return false;
            if (!edge.source || typeof edge.source !== 'string') return false;
            if (!edge.target || typeof edge.target !== 'string') return false;
        }

        return true;
    } catch (e) {
        return false;
    }
};

export const cleanDiagramState = (data: any): any => {
    // Strip prototype properties to prevent prototype pollution
    const stripPrototype = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(stripPrototype);
        const result: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
                    result[key] = stripPrototype(obj[key]);
                }
            }
        }
        return result;
    };

    return stripPrototype(data);
};
