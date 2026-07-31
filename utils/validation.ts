export const validateDiagramState = (jsonString: string): any => {
    try {
        const parsed = JSON.parse(jsonString, (key, value) => {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                return undefined;
            }
            return value;
        });

        // Basic schema validation
        if (parsed && typeof parsed === 'object') {
            if (parsed.nodes !== undefined && !Array.isArray(parsed.nodes)) {
                throw new Error("Invalid schema: nodes must be an array");
            }
            if (parsed.edges !== undefined && !Array.isArray(parsed.edges)) {
                throw new Error("Invalid schema: edges must be an array");
            }
        }

        return parsed;
    } catch (error) {
        throw new Error("Failed to parse or validate diagram state");
    }
};
