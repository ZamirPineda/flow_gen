1. **Create `utils/validation.ts`**
   - Implement `validateDiagramState` to perform strict schema validation on the imported JSON data (checking for `nodes` and `edges` arrays).
   - Add string sanitization to mitigate XSS and defend against prototype pollution (`__proto__`, `constructor`).

2. **Update `hooks/useFlowController.ts`**
   - Integrate `validateDiagramState` inside `handleImport`.
   - Update the `catch` block to surface validation failures using the Toast system (`addToast`) instead of failing silently or using a generic message.
   - Also apply `validateDiagramState` when loading from `localStorage` in the `useEffect` hook to prevent persistent malicious state.

3. **Complete pre commit steps**
   - Ensure proper testing, verifications, reviews and reflections are done.

4. **Message the User & Submit**
   - Structure the response in three parts: 1. Análisis de Seguridad, 2. Propuesta de Código, 3. Explicación Arquitectónica.
   - Submit the changes using the `submit` tool.
