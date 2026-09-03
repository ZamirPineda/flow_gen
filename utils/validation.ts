export const validateDiagramState = (data: any): any => {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid state: Root must be an object.");
    }

    const stripPrototypePollution = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(stripPrototypePollution);
        } else if (obj !== null && typeof obj === 'object') {
            const safeObj: any = {};
            for (const key in obj) {
                // Ensure key is actually an own property and not an inherited one,
                // and block '__proto__', 'constructor', 'prototype'
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                        continue; // Skip dangerous keys
                    }
                    safeObj[key] = stripPrototypePollution(obj[key]);
                }
            }
            return safeObj;
        }
        return obj;
    };

    const safeData = stripPrototypePollution(data);

    // Basic schema check
    if (!safeData.nodes || !Array.isArray(safeData.nodes)) {
        throw new Error("Invalid schema: 'nodes' must be an array.");
    }
    if (!safeData.edges || !Array.isArray(safeData.edges)) {
        throw new Error("Invalid schema: 'edges' must be an array.");
    }

    return safeData;
};
