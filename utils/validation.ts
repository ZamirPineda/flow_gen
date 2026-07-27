export const stripPrototypeProperties = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(stripPrototypeProperties);
    }

    const stripped: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
                stripped[key] = stripPrototypeProperties(obj[key]);
            }
        }
    }

    return stripped;
};

export const validateDiagramState = (data: any): any => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid diagram state: must be an object');
    }

    const cleanData = stripPrototypeProperties(data);

    if (!Array.isArray(cleanData.nodes)) {
        throw new Error('Invalid diagram state: missing or invalid nodes array');
    }

    if (!Array.isArray(cleanData.edges)) {
        throw new Error('Invalid diagram state: missing or invalid edges array');
    }

    return cleanData;
};
