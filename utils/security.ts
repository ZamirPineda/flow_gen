/**
 * Security utilities for the application.
 * Following Security-First policies for sanitization, cloning, and unique IDs.
 */

/**
 * Sanitizes a string by escaping HTML characters to prevent Cross-Site Scripting (XSS).
 * @param input The raw string input from user or external source.
 * @returns Sanitized string safe for rendering.
 */
export const sanitizeString = (input: string | undefined | null): string => {
    if (!input) return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Safely clones an object to prevent object reference sharing and potential Prototype Pollution.
 * @param obj The object to clone.
 * @returns A deep copy of the object.
 */
export const safeClone = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(obj);
        } catch (e) {
            // Fallback for objects that cannot be cloned by structuredClone (e.g., Functions, DOM nodes)
            return JSON.parse(JSON.stringify(obj));
        }
    }
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Generates a cryptographically secure UUID.
 * Replaces insecure Math.random() and Date.now() methods.
 * @returns A secure UUID string.
 */
export const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback if crypto.randomUUID is not available in the environment
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return (1e7 + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, (c: any) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Absolute fallback (should not reach here in modern browsers)
    console.warn("crypto.randomUUID and getRandomValues are not supported. Falling back to insecure UUID generator.");
    let d = new Date().getTime();
    let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
