
import { useEffect } from 'react';
import { Node, Edge } from 'reactflow';

export const useKeyboardShortcuts = (
    undo: (nodes: Node[], edges: Edge[]) => void,
    redo: (nodes: Node[], edges: Edge[]) => void,
    nodes: Node[],
    edges: Edge[]
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo(nodes, edges);
                else undo(nodes, edges);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo(nodes, edges);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges, undo, redo]);
};
