/**
 * Utility for securely generating and downloading CSV files.
 */

/**
 * Sanitizes a cell value to prevent CSV Injection (Formula Injection).
 * If a value starts with a formula trigger (=, +, -, @, \t, \r), it prepends a single quote.
 * It also escapes double quotes by replacing them with double-double quotes and wraps
 * the entire value in double quotes.
 *
 * @param value The raw string or number to sanitize
 * @returns The sanitized string ready for CSV insertion
 */
export const sanitizeCellValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '""';

    let strValue = String(value);

    // Prevent formula injection
    if (/^[=+\-@\t\r]/.test(strValue)) {
        strValue = "'" + strValue;
    }

    // Escape double quotes
    strValue = strValue.replace(/"/g, '""');

    // Wrap in double quotes
    return `"${strValue}"`;
};

/**
 * Safely downloads a blob by creating an object URL and automatically revoking it
 * after a short timeout to prevent memory leaks.
 *
 * @param blob The Blob object to download
 * @param filename The desired filename
 */
export const downloadFileFromBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory after allowing the browser time to start the download
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 150);
};
