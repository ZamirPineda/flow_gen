import DOMPurify from 'dompurify';

export const validateDiagramState = (data: any): any => {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid diagram data format.");
    }

    const cleanObject = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(cleanObject);
        }

        if (obj !== null && typeof obj === 'object') {
            const cleaned: any = {};
            for (const key in obj) {
                // Strict check for prototype pollution vectors
                if (['__proto__', 'constructor', 'prototype'].includes(key)) {
                    continue; // Skip dangerous keys
                }

                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    // Specific sanitization for known string fields prone to XSS
                    if (['label', 'details', 'technology', 'stage'].includes(key) && typeof obj[key] === 'string') {
                        cleaned[key] = DOMPurify.sanitize(obj[key]);
                    } else {
                        cleaned[key] = cleanObject(obj[key]);
                    }
                }
            }
            return cleaned;
        }

        return obj;
    };

    const validatedData = cleanObject(data);

    if (!Array.isArray(validatedData.nodes)) {
         throw new Error("Diagram state must contain a valid nodes array.");
    }

    if (validatedData.edges !== undefined && !Array.isArray(validatedData.edges)) {
        throw new Error("Diagram edges must be an array if provided.");
    }

    return validatedData;
};
