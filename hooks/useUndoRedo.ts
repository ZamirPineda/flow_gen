
import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

// Setters type
type SetNodes = (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
type SetEdges = (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;

export const useUndoRedo = (
  initialNodes: Node[], 
  initialEdges: Edge[]
) => {
  const [past, setPast] = useState<GraphState[]>([]);
  const [future, setFuture] = useState<GraphState[]>([]);

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    // Deep clone to prevent reference issues
    const snapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges))
    };
    
    setPast((prev) => [...prev, snapshot]);
    setFuture([]); // Clear future on new action
  }, []);

  const undo = useCallback((
      currentNodes: Node[], 
      currentEdges: Edge[], 
      setNodes: SetNodes, 
      setEdges: SetEdges
  ) => {
    if (past.length === 0) return;

    const newPast = [...past];
    const previousState = newPast.pop();

    if (previousState) {
        // Save current state to future before undoing
        const currentSnapshot = {
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges))
        };
        setFuture((prev) => [currentSnapshot, ...prev]);
        
        // Apply previous state
        setNodes(previousState.nodes);
        setEdges(previousState.edges);
        setPast(newPast);
    }
  }, [past]);

  const redo = useCallback((
      currentNodes: Node[], 
      currentEdges: Edge[],
      setNodes: SetNodes,
      setEdges: SetEdges
  ) => {
    if (future.length === 0) return;

    const newFuture = [...future];
    const nextState = newFuture.shift();

    if (nextState) {
        // Save current state to past before redoing
        const currentSnapshot = {
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges))
        };
        setPast((prev) => [...prev, currentSnapshot]);

        // Apply next state
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        setFuture(newFuture);
    }
  }, [future]);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
};
