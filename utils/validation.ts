export const validateDiagramState = (data: any): any => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid diagram state format');
    }

    if (!Array.isArray(data.nodes)) {
        throw new Error('Missing or invalid nodes array');
    }

    if (!Array.isArray(data.edges)) {
        throw new Error('Missing or invalid edges array');
    }

    const stripDangerousProps = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => stripDangerousProps(item));
        }

        const cleaned: Record<string, any> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    continue; // Skip dangerous properties
                }
                cleaned[key] = stripDangerousProps(obj[key]);
            }
        }
        return cleaned;
    };

    return stripDangerousProps(data);
};
