import { validateDiagramState, stripPrototypeProperties } from './validation';
import { expect, test, describe } from 'bun:test';

describe('Validation', () => {
    test('stripPrototypeProperties removes unsafe keys', () => {
        const payload = JSON.parse('{"__proto__": {"admin": true}, "constructor": {"prototype": {"admin": true}}, "prototype": {}, "valid": "data"}');
        const stripped = stripPrototypeProperties(payload);

        expect(stripped.valid).toBe('data');
        // Because the returned object from JSON.parse inherits from Object.prototype,
        // __proto__ still resolves to Object.prototype natively.
        // We ensure that the specific nested property payload is gone.
        expect((stripped as any).admin).toBeUndefined();
        expect(stripped.constructor).toBe(Object);
        expect(stripped.prototype).toBeUndefined();
    });

    test('validateDiagramState accepts valid diagram', () => {
        const valid = {
            nodes: [{ id: '1' }],
            edges: [{ id: 'e1' }]
        };
        const validated = validateDiagramState(valid);
        expect(validated.nodes.length).toBe(1);
        expect(validated.edges.length).toBe(1);
    });

    test('validateDiagramState rejects missing nodes array', () => {
        const invalid = { edges: [] };
        expect(() => validateDiagramState(invalid)).toThrow('missing or invalid nodes array');
    });

    test('validateDiagramState rejects missing edges array', () => {
        const invalid = { nodes: [] };
        expect(() => validateDiagramState(invalid)).toThrow('missing or invalid edges array');
    });

    test('validateDiagramState strips unsafe properties', () => {
        const invalid = JSON.parse('{"nodes": [], "edges": [], "__proto__": {"admin": true}}');
        const validated = validateDiagramState(invalid);
        expect((validated as any).admin).toBeUndefined();
        expect((validated as any).__proto__).not.toEqual({ admin: true });
    });
});
