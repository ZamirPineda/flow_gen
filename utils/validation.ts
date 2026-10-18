export const validateDiagramState = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => validateDiagramState(item));
  }

  if (typeof data === 'object') {
    const safeObj: any = {};
    for (const key in data) {
      if (
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype'
      ) {
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(data, key)) {
         safeObj[key] = validateDiagramState(data[key]);
      }
    }
    return safeObj;
  }

  return data;
};
