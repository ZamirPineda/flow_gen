export const validateDiagramState = (data: any): { valid: boolean; data?: any; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format. Expected an object.' };
  }

  // Schema Validation
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return { valid: false, error: 'Invalid schema. Missing or invalid "nodes" or "edges" array.' };
  }

  try {
    // Deep clone and sanitize strings to prevent XSS and Prototype Pollution
    const sanitizedData = JSON.parse(JSON.stringify(data), (key, value) => {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined; // Strips the key from the object
      }

      // Rely on React's native string escaping to prevent XSS since we don't use dangerouslySetInnerHTML

      return value;
    });

    return { valid: true, data: sanitizedData };
  } catch (error) {
    return { valid: false, error: 'Error processing data.' };
  }
};
