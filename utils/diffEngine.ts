
import { Node, Edge } from 'reactflow';
import { NodeData } from '../types';

interface GraphState {
    nodes: Node<NodeData>[];
    edges: Edge[];
}

export const computeGraphDiff = (
    oldGraph: GraphState, 
    newGraph: GraphState
): GraphState => {
    
    // 1. Process Nodes
    const oldNodeMap = new Map(oldGraph.nodes.map(n => [n.id, n]));
    const newNodeMap = new Map(newGraph.nodes.map(n => [n.id, n]));
    
    const mergedNodes: Node<NodeData>[] = [];
    const processedIds = new Set<string>();

    // Check New Nodes (Added or Modified)
    newGraph.nodes.forEach(newNode => {
        processedIds.add(newNode.id);
        
        if (!oldNodeMap.has(newNode.id)) {
            // NEW NODE
            mergedNodes.push({
                ...newNode,
                data: { ...newNode.data, diffStatus: 'added' }
            });
        } else {
            // EXISTING NODE - Check for changes
            const oldNode = oldNodeMap.get(newNode.id)!;
            
            // Simple comparison of key visual fields
            const isModified = 
                oldNode.data.label !== newNode.data.label ||
                oldNode.data.technology !== newNode.data.technology ||
                oldNode.data.variant !== newNode.data.variant ||
                oldNode.parentNode !== newNode.parentNode;

            mergedNodes.push({
                ...newNode,
                data: { ...newNode.data, diffStatus: isModified ? 'modified' : 'unchanged' }
            });
        }
    });

    // Check Old Nodes (Removed)
    oldGraph.nodes.forEach(oldNode => {
        if (!processedIds.has(oldNode.id)) {
            // DELETED NODE
            // We keep it in the graph to show it was removed
            mergedNodes.push({
                ...oldNode,
                data: { ...oldNode.data, diffStatus: 'removed' },
                selectable: false,
                draggable: false
            });
        }
    });

    // 2. Process Edges
    const oldEdgeMap = new Map(oldGraph.edges.map(e => [e.id, e]));
    const newEdgeMap = new Map(newGraph.edges.map(e => [e.id, e]));
    
    const mergedEdges: Edge[] = [];
    const processedEdgeIds = new Set<string>();

    // Helper to identify edges by connection (since IDs might regenerate randomly)
    // Format: "sourceId-targetId"
    const getEdgeKey = (e: Edge) => `${e.source}-${e.target}`;
    const oldEdgeKeys = new Set(oldGraph.edges.map(getEdgeKey));

    newGraph.edges.forEach(newEdge => {
        processedEdgeIds.add(newEdge.id);
        const key = getEdgeKey(newEdge);

        if (!oldEdgeMap.has(newEdge.id) && !oldEdgeKeys.has(key)) {
            mergedEdges.push({
                ...newEdge,
                animated: true,
                data: { ...newEdge.data, diffStatus: 'added' },
                style: { ...newEdge.style, strokeDasharray: '5 5' }
            });
        } else {
            mergedEdges.push({
                ...newEdge,
                data: { ...newEdge.data, diffStatus: 'unchanged' }
            });
        }
    });

    oldGraph.edges.forEach(oldEdge => {
        // If exact ID missing AND connection logic missing
        // (We check connection logic because auto-generated IDs change)
        const key = getEdgeKey(oldEdge);
        const existsInNew = newGraph.edges.some(ne => getEdgeKey(ne) === key);

        if (!existsInNew) {
             mergedEdges.push({
                ...oldEdge,
                animated: false,
                data: { ...oldEdge.data, diffStatus: 'removed' },
                style: { ...oldEdge.style, opacity: 0.4 }
            });
        }
    });

    return { nodes: mergedNodes, edges: mergedEdges };
};
