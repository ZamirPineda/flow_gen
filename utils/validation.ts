/**
 * Utility for schema validation and mitigation of Prototype Pollution.
 */

const stripPrototypePollution = (obj: any): any => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(stripPrototypePollution);
    }

    const cleaned: any = {};
    for (const key in obj) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cleaned[key] = stripPrototypePollution(obj[key]);
        }
    }
    return cleaned;
};

export const validateDiagramState = (data: any): any => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid diagram state: must be an object');
    }

    const cleanedData = stripPrototypePollution(data);

    if (!Array.isArray(cleanedData.nodes)) {
        throw new Error('Invalid diagram state: nodes must be an array');
    }

    if (!Array.isArray(cleanedData.edges)) {
        throw new Error('Invalid diagram state: edges must be an array');
    }

    // Basic structural validation for nodes
    cleanedData.nodes.forEach((node: any, index: number) => {
        if (!node || typeof node !== 'object') {
            throw new Error(`Invalid node at index ${index}: must be an object`);
        }
        if (typeof node.id !== 'string') {
            throw new Error(`Invalid node at index ${index}: missing or invalid id`);
        }
        if (typeof node.position !== 'object' || node.position === null) {
            throw new Error(`Invalid node at index ${index}: missing or invalid position`);
        }
        if (typeof node.data !== 'object' || node.data === null) {
            throw new Error(`Invalid node at index ${index}: missing or invalid data`);
        }
    });

    // Basic structural validation for edges
    cleanedData.edges.forEach((edge: any, index: number) => {
        if (!edge || typeof edge !== 'object') {
            throw new Error(`Invalid edge at index ${index}: must be an object`);
        }
        if (typeof edge.id !== 'string') {
            throw new Error(`Invalid edge at index ${index}: missing or invalid id`);
        }
        if (typeof edge.source !== 'string') {
            throw new Error(`Invalid edge at index ${index}: missing or invalid source`);
        }
        if (typeof edge.target !== 'string') {
            throw new Error(`Invalid edge at index ${index}: missing or invalid target`);
        }
    });

    return cleanedData;
};