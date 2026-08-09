export function validateDiagramState(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(validateDiagramState);
    }

    const result: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
                result[key] = validateDiagramState(obj[key]);
            }
        }
    }
    return result;
}
