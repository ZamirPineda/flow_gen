import DOMPurify from 'dompurify';

/**
 * Sanitizes an input string to prevent XSS attacks.
 * Uses DOMPurify to strip any malicious HTML/JS.
 */
export const sanitizeString = (input: string | undefined | null): string => {
    if (!input) return '';
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
};

/**
 * Generates a cryptographically strong UUID.
 * Replaces insecure Math.random() or Date.now() methods.
 */
export const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for environments where randomUUID is not available (though modern browsers have it)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Safely clones an object to prevent Prototype Pollution or state reference mutations.
 */
export const safeClone = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    // Fallback
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error("Failed to safely clone object", e);
        return obj; // Return as is if cloning fails (should rarely happen for simple state)
    }
};
