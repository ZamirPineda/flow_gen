/**
 * Sanitizes a cell value for CSV export to prevent CSV/Formula Injection.
 * Prepends a single quote to values starting with formula triggers (=, +, -, @).
 * Escapes double quotes by replacing them with two double quotes ("").
 */
export const sanitizeCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';

    let strValue = String(value);

    // Escape double quotes
    strValue = strValue.replace(/"/g, '""');

    // Check for formula triggers
    if (/^[=+\-@]/.test(strValue)) {
        strValue = "'" + strValue;
    }

    return strValue;
};
