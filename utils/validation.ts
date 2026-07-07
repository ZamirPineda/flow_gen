export function validateDiagramState(data: any): any {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid diagram state format');
    }

    // Clone data and strip prototype properties
    const cloneDeep = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(cloneDeep);
        }

        const cloned: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    continue;
                }
                cloned[key] = cloneDeep(obj[key]);
            }
        }
        return cloned;
    };

    const sanitizedData = cloneDeep(data);

    // Schema Validation
    if (!Array.isArray(sanitizedData.nodes) || !Array.isArray(sanitizedData.edges)) {
        throw new Error('Diagram state missing nodes or edges arrays');
    }

    return sanitizedData;
}
