export const validateDiagramState = (data: any): boolean => {
    // Strip prototype pollution vectors
    if (data && typeof data === 'object') {
        delete data.__proto__;
        delete data.constructor;
        delete data.prototype;
    }

    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        return false;
    }

    // Basic schema validation for nodes
    for (const node of data.nodes) {
        if (!node.id || typeof node.id !== 'string') return false;
        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') return false;

        // Strip nested prototype pollution vectors
        if (node.data && typeof node.data === 'object') {
            delete node.data.__proto__;
            delete node.data.constructor;
            delete node.data.prototype;
        }
    }

    // Basic schema validation for edges
    for (const edge of data.edges) {
        if (!edge.id || typeof edge.id !== 'string') return false;
        if (!edge.source || typeof edge.source !== 'string') return false;
        if (!edge.target || typeof edge.target !== 'string') return false;
    }

    return true;
};
