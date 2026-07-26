import { test, expect } from "bun:test";
import { validateDiagramState } from "./validation";

test("validates well-formed diagram state", () => {
    const validData = {
        nodes: [{ id: "1", type: "custom", data: { label: "A" } }],
        edges: []
    };
    const result = validateDiagramState(validData);
    expect(result).toEqual(validData);
});

test("throws on invalid diagram state (missing nodes)", () => {
    const invalidData = { edges: [] };
    expect(() => validateDiagramState(invalidData)).toThrow("Missing or invalid nodes array");
});

test("strips dangerous properties (Prototype Pollution)", () => {
    // When using JSON.parse with a malicious payload, the standard JavaScript parsing doesn't always
    // inject properties into the Object prototype immediately. We simulate the vulnerability explicitly.
    const maliciousData = {
        "nodes": [],
        "edges": [],
        "someSafeKey": "value"
    };
    Object.defineProperty(maliciousData, '__proto__', {
        value: { polluted: true }, enumerable: true
    });
    Object.defineProperty(maliciousData, 'constructor', {
        value: { prototype: { polluted: true } }, enumerable: true
    });

    const result = validateDiagramState(maliciousData);

    // We check that in the parsed object, those specific keys do not exist
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(false);
    expect(result.someSafeKey).toBe("value");
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
});
