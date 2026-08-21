import { Node, Edge } from 'reactflow';
import { NodeData } from '../types';

export const validateDiagramState = (parsedData: any): ({ nodes: Node<NodeData>[]; edges: Edge[] } & Record<string, any>) | null => {
    if (!parsedData || typeof parsedData !== 'object') {
        return null;
    }

    // Strip prototype pollution properties deeply
    const sanitizeObj = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeObj);

        const newObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    continue;
                }
                newObj[key] = sanitizeObj(obj[key]);
            }
        }
        return newObj;
    };

    const sanitizedData = sanitizeObj(parsedData);

    if (!Array.isArray(sanitizedData.nodes) || !Array.isArray(sanitizedData.edges)) {
        return null;
    }

    return {
        nodes: sanitizedData.nodes,
        edges: sanitizedData.edges,
        ...sanitizedData
    };
};
