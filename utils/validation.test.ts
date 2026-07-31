import { expect, test, describe } from "bun:test";
import { validateDiagramState } from "./validation";

describe("validateDiagramState", () => {
    test("should parse valid diagram state", () => {
        const validState = {
            nodes: [{ id: "1" }],
            edges: []
        };
        const result = validateDiagramState(JSON.stringify(validState));
        expect(result).toEqual(validState);
    });

    test("should strip __proto__", () => {
        const payload = '{"__proto__":{"polluted":"yes"},"nodes":[]}';
        const result = validateDiagramState(payload);

        // Ensure that prototype pollution did not occur
        expect(({} as any)["polluted"]).toBeUndefined();

        // The __proto__ key should not exist as an own property
        const hasProto = Object.prototype.hasOwnProperty.call(result, '__proto__');
        expect(hasProto).toBe(false);
    });

    test("should strip constructor", () => {
        const payload = '{"constructor":{"prototype":{"polluted":"yes"}},"nodes":[]}';
        const result = validateDiagramState(payload);

        // Ensure that prototype pollution did not occur
        expect(({} as any)["polluted"]).toBeUndefined();

        const hasConstructor = Object.prototype.hasOwnProperty.call(result, 'constructor');
        expect(hasConstructor).toBe(false);
    });

    test("should strip prototype", () => {
        const payload = '{"prototype":{"polluted":"yes"},"nodes":[]}';
        const result = validateDiagramState(payload);

        const hasPrototype = Object.prototype.hasOwnProperty.call(result, 'prototype');
        expect(hasPrototype).toBe(false);
    });

    test("should throw error on invalid nodes schema", () => {
        const payload = '{"nodes":{}}';
        expect(() => validateDiagramState(payload)).toThrow("Failed to parse or validate diagram state");
    });

    test("should throw error on invalid edges schema", () => {
        const payload = '{"nodes":[], "edges":{}}';
        expect(() => validateDiagramState(payload)).toThrow("Failed to parse or validate diagram state");
    });

    test("should throw error on invalid JSON", () => {
        const payload = '{"nodes":[]'; // missing closing brace
        expect(() => validateDiagramState(payload)).toThrow("Failed to parse or validate diagram state");
    });
});
