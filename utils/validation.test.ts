import { describe, it, expect } from 'bun:test';
import { validateDiagramState, stripPrototypeProperties } from './validation';

describe('Validation Utils', () => {
  describe('stripPrototypeProperties', () => {
    it('should strip prototype pollution vectors from an object', () => {
      const maliciousPayload = JSON.parse('{"__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}, "safe": "value"}');

      const safeData = stripPrototypeProperties(maliciousPayload);

      expect(safeData.safe).toBe('value');

      // Use Object.prototype.hasOwnProperty.call as plain objects inherit these properties
      expect(Object.prototype.hasOwnProperty.call(safeData, '__proto__')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(safeData, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(safeData, 'prototype')).toBe(false);
    });

    it('should correctly strip vectors recursively', () => {
        const maliciousPayload = JSON.parse('{"nested": {"__proto__": {"polluted": true}}, "arr": [{"__proto__": {"polluted": true}}]}');

        const safeData = stripPrototypeProperties(maliciousPayload);

        expect(Object.prototype.hasOwnProperty.call(safeData.nested, '__proto__')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(safeData.arr[0], '__proto__')).toBe(false);
    });

    it('should handle null, primitives, and arrays correctly', () => {
      expect(stripPrototypeProperties(null)).toBeNull();
      expect(stripPrototypeProperties('string')).toBe('string');
      expect(stripPrototypeProperties(123)).toBe(123);
      expect(stripPrototypeProperties([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('validateDiagramState', () => {
    it('should invalidate non-object data', () => {
      const result = validateDiagramState('invalid');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data must be an object');
    });

    it('should invalidate missing nodes or edges', () => {
      let result = validateDiagramState({ nodes: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data must contain nodes and edges arrays');

      result = validateDiagramState({ edges: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data must contain nodes and edges arrays');
    });

    it('should validate correctly formatted data and strip prototypes', () => {
      const maliciousData = JSON.parse('{"nodes": [], "edges": [], "__proto__": {"polluted": true}}');

      const result = validateDiagramState(maliciousData);

      expect(result.valid).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(result.data, '__proto__')).toBe(false);
    });
  });
});
