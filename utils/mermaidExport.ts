
import { Node, Edge } from 'reactflow';
import { DiagramType } from '../types';

/**
 * Sanitizes an ID to be Mermaid-safe (alphanumeric + underscores only)
 */
const cleanId = (id: string): string => {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
};

/**
 * Converts React Flow nodes and edges into a Mermaid.js definition string.
 */
export const toMermaid = (
    nodes: Node[], 
    edges: Edge[], 
    direction: string = 'LR'
): string => {
    // 1. Detect if this is a Sequence Diagram
    // We check if any node has the 'lifeline' variant or if DiagramType is UML
    const isSequence = nodes.some(n => n.data.variant === 'lifeline');

    if (isSequence) {
        return generateSequenceDiagram(nodes, edges);
    }

    return generateFlowchart(nodes, edges, direction);
};

const generateSequenceDiagram = (nodes: Node[], edges: Edge[]): string => {
    let mmd = 'sequenceDiagram\n';
    
    // 1. Participants (Actors/Lifelines)
    // Filter out UI nodes
    const actors = nodes.filter(n => 
        n.type !== 'title' && 
        n.type !== 'defs' && 
        n.type !== 'group' &&
        !n.hidden
    );

    // Sort actors by X position to maintain left-to-right order
    actors.sort((a, b) => a.position.x - b.position.x);

    actors.forEach(node => {
        // Use 'actor' keyword for Users/Clients, 'participant' for others
        const type = node.data.variant === 'client' ? 'actor' : 'participant';
        mmd += `    ${type} ${cleanId(node.id)} as ${node.data.label}\n`;
    });

    mmd += '\n';

    // 2. Messages (Edges)
    // Sort edges by 'order' data to ensure correct sequence flow
    const sortedEdges = [...edges].sort((a, b) => (a.data?.order || 0) - (b.data?.order || 0));

    sortedEdges.forEach(edge => {
        const sourceId = cleanId(edge.source);
        const targetId = cleanId(edge.target);
        const label = edge.label || '';
        
        // Determine arrow type based on message type
        // standard: ->>, return: -->>, async: -)
        let arrow = '->>';
        if (edge.data?.messageType === 'return') arrow = '-->>';
        if (edge.data?.messageType === 'async') arrow = '-)';
        
        // Check for special loop/alt logic in labels (simple heuristic)
        // Note: Mermaid handles loops via blocks, which is hard to infer purely from edge list
        // without complex graph analysis. We stick to simple messages for now.
        
        mmd += `    ${sourceId}${arrow}${targetId}: ${label}\n`;
    });

    return mmd;
};

const generateFlowchart = (nodes: Node[], edges: Edge[], direction: string): string => {
    // Map direction to Mermaid syntax
    const dir = direction === 'LR' ? 'LR' : 'TD';
    let mmd = `graph ${dir}\n`;

    // Add some basic styling classes
    mmd += `    %% Styling\n    classDef default fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#fff;\n    classDef cluster fill:#0f172a,stroke:#475569,color:#fff,stroke-dasharray: 5 5;\n\n`;

    // Filter relevant nodes
    const allNodes = nodes.filter(n => n.type !== 'title' && n.type !== 'defs');
    const groups = allNodes.filter(n => n.type === 'group');
    const simpleNodes = allNodes.filter(n => n.type !== 'group');
    
    const processedNodeIds = new Set<string>();

    // 1. Handle Groups (Subgraphs)
    groups.forEach(group => {
        const groupId = cleanId(group.id);
        const label = group.data.label || 'Group';
        
        mmd += `    subgraph ${groupId} ["${label}"]\n`;
        mmd += `        direction ${dir}\n`; // Inherit direction

        // Find children of this group
        const children = simpleNodes.filter(n => n.parentNode === group.id);
        children.forEach(child => {
            const childId = cleanId(child.id);
            const childLabel = child.data.label || 'Node';
            // Sanitize label quotes
            const safeLabel = childLabel.replace(/"/g, "'");
            
            // Add node definition
            // Shape determination based on variant could be added here
            // e.g. database uses [()] shape
            const shapeOpen = child.data.variant === 'database' ? '[(' : '[';
            const shapeClose = child.data.variant === 'database' ? ')]' : ']';

            mmd += `        ${childId}${shapeOpen}"${safeLabel}"${shapeClose}\n`;
            processedNodeIds.add(child.id);
        });

        mmd += `    end\n`;
        // Apply cluster class
        mmd += `    class ${groupId} cluster;\n`;
    });

    // 2. Handle Orphan Nodes (Outside any group)
    simpleNodes.forEach(node => {
        if (!processedNodeIds.has(node.id)) {
            const nodeId = cleanId(node.id);
            const label = node.data.label.replace(/"/g, "'");
            const shapeOpen = node.data.variant === 'database' ? '[(' : '[';
            const shapeClose = node.data.variant === 'database' ? ')]' : ']';
            
            mmd += `    ${nodeId}${shapeOpen}"${label}"${shapeClose}\n`;
        }
    });

    mmd += '\n';

    // 3. Edges
    edges.forEach(edge => {
        const sourceId = cleanId(edge.source);
        const targetId = cleanId(edge.target);
        
        // Skip edges connected to non-existent nodes (safety check)
        const sourceExists = allNodes.some(n => cleanId(n.id) === sourceId);
        const targetExists = allNodes.some(n => cleanId(n.id) === targetId);

        if (sourceExists && targetExists) {
            let label = edge.label ? `|"${edge.label}"|` : '';
            // Basic arrow
            mmd += `    ${sourceId} -->${label} ${targetId}\n`;
        }
    });

    return mmd;
};
