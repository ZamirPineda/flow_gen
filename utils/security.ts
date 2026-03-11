
/**
 * Sanitizes a string by escaping HTML characters to prevent XSS attacks.
 * Replaces special characters with their HTML entities.
 *
 * @param input The raw string to sanitize.
 * @returns The sanitized string safe for rendering.
 */
export const sanitizeString = (input: string | undefined | null): string => {
    if (!input) return '';
    return input.replace(/[&<>"']/g, (match) => {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
        }
    });
};

/**
 * Validates if a URL is a secure GitHub repository URL.
 * Enforces HTTPS and standard GitHub domain (including www).
 *
 * @param url The URL to validate.
 * @returns True if the URL is valid and secure.
 */
export const isValidGitHubUrl = (url: string): boolean => {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'https:') return false;

        return parsedUrl.hostname === 'github.com' || parsedUrl.hostname === 'www.github.com';
    } catch {
        return false;
    }
};

/**
 * Deep clones an object safely.
 * Uses structuredClone if available, otherwise falls back to JSON serialization.
 *
 * @param obj The object to clone.
 * @returns A deep clone of the object.
 */
export const safeClone = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
};
