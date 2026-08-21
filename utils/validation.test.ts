import { expect, test, describe } from "bun:test";
import { validateDiagramState } from "./validation";

describe("validateDiagramState", () => {
    test("should successfully validate and return valid diagram state", () => {
        const input = {
            nodes: [{ id: "1", type: "custom", position: { x: 0, y: 0 }, data: { label: "Test Node" } }],
            edges: [{ id: "e1", source: "1", target: "2" }]
        };

        const result = validateDiagramState(input);
        expect(result).not.toBeNull();
        expect(result?.nodes.length).toBe(1);
        expect(result?.edges.length).toBe(1);
    });

    test("should strip prototype properties to mitigate prototype pollution", () => {
        // We use JSON.parse here to simulate an attack vector where a JSON file contains __proto__
        const maliciousPayload = '{"nodes": [], "edges": [], "__proto__": {"polluted": "yes"}, "constructor": {"polluted": "yes"}}';
        const parsed = JSON.parse(maliciousPayload);

        const result = validateDiagramState(parsed);

        expect(result).not.toBeNull();

        // Use Object.prototype.hasOwnProperty.call as strictly instructed to assert that the keys do not exist as own properties
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(result, 'prototype')).toBe(false);

        // Assert that the prototype was not actually polluted
        expect((result as any).polluted).toBeUndefined();
    });

    test("should return null for invalid inputs", () => {
        expect(validateDiagramState(null)).toBeNull();
        expect(validateDiagramState(undefined)).toBeNull();
        expect(validateDiagramState("string")).toBeNull();
        expect(validateDiagramState({ nodes: [] })).toBeNull(); // missing edges
        expect(validateDiagramState({ edges: [] })).toBeNull(); // missing nodes
    });
});
