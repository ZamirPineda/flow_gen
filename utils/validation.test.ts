import { describe, it, expect } from 'bun:test';
import { validateDiagramState } from './validation';

describe('validateDiagramState', () => {
    it('should validate and pass a correct diagram state', () => {
        const validState = {
            nodes: [{ id: '1' }],
            edges: [{ id: 'e1' }]
        };
        const result = validateDiagramState(validState);
        expect(result.nodes).toEqual([{ id: '1' }]);
        expect(result.edges).toEqual([{ id: 'e1' }]);
    });

    it('should throw error if input is not an object', () => {
        expect(() => validateDiagramState(null)).toThrow('Invalid format: Expected an object.');
        expect(() => validateDiagramState('string')).toThrow('Invalid format: Expected an object.');
    });

    it('should throw error if nodes or edges are not arrays', () => {
        const invalidState1 = { nodes: {}, edges: [] };
        expect(() => validateDiagramState(invalidState1)).toThrow("Invalid schema: 'nodes' and 'edges' must be arrays.");

        const invalidState2 = { nodes: [], edges: {} };
        expect(() => validateDiagramState(invalidState2)).toThrow("Invalid schema: 'nodes' and 'edges' must be arrays.");
    });

    it('should recursively strip prototype pollution vectors', () => {
        const payload = JSON.parse('{"__proto__": {"polluted": true}, "nodes": [{"id": "1", "constructor": {"polluted": true}}], "edges": [{"id": "e1", "prototype": {"polluted": true}}]}');

        const result = validateDiagramState(payload);

        // Assert that the properties were removed from the parsed objects
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result.nodes[0], 'constructor')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result.edges[0], 'prototype')).toBe(false);
    });
});
