export const stripPrototypeProperties = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(stripPrototypeProperties);
  }

  const result: any = {};
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    result[key] = stripPrototypeProperties(obj[key]);
  }

  return result;
};

export const validateDiagramState = (data: any): { valid: boolean; data?: any; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' };
  }

  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return { valid: false, error: 'Data must contain nodes and edges arrays' };
  }

  // Strip prototype pollution vectors
  const safeData = stripPrototypeProperties(data);
  return { valid: true, data: safeData };
};
