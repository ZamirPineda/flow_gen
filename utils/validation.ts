import DOMPurify from 'dompurify';

export const validateDiagramState = (data: any): boolean => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;

    // Check basic structure before proceeding
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        return false;
    }

    // A helper to safely delete prototype pollution keys
    const stripPollution = (obj: any) => {
        if (obj && typeof obj === 'object') {
            if (Object.prototype.hasOwnProperty.call(obj, '__proto__')) delete obj.__proto__;
            if (Object.prototype.hasOwnProperty.call(obj, 'constructor')) delete obj.constructor;
            if (Object.prototype.hasOwnProperty.call(obj, 'prototype')) delete obj.prototype;
        }
    };

    stripPollution(data);

    data.nodes.forEach((node: any) => {
        if (!node) return;
        stripPollution(node);
        if (node.data) {
            stripPollution(node.data);
            if (typeof node.data.label === 'string') {
                node.data.label = DOMPurify.sanitize(node.data.label);
            }
            if (typeof node.data.details === 'string') {
                node.data.details = DOMPurify.sanitize(node.data.details);
            }
        }
    });

    data.edges.forEach((edge: any) => {
        if (!edge) return;
        stripPollution(edge);
        if (edge.data) {
            stripPollution(edge.data);
        }
        if (typeof edge.label === 'string') {
             edge.label = DOMPurify.sanitize(edge.label);
        }
    });

    return true;
};
