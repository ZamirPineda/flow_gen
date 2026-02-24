
import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';
import { THEME } from '../theme';
import { DiagramType } from '../types';

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'LR',
  isSequence = false 
) => {
  
  // --- SPECIAL LAYOUT: SEQUENCE DIAGRAM ---
  if (isSequence) {
    const spacingX = THEME.dimensions.sequenceActorSpacing;
    const stepHeight = THEME.dimensions.sequenceStepHeight;
    const headerHeight = 80; 

    const actorNodes = nodes.filter(n => n.type !== 'title' && n.type !== 'defs' && n.type !== 'group');
    const titleNode = nodes.find(n => n.type === 'title');
    const defsNode = nodes.find(n => n.type === 'defs');

    const sortedEdges = [...edges].sort((a, b) => (a.data?.order || 0) - (b.data?.order || 0));
    const maxOrder = sortedEdges.length > 0 
      ? (sortedEdges[sortedEdges.length - 1].data?.order || 1) 
      : 1;

    const nodeActivity: Record<string, { min: number, max: number }> = {};
    
    sortedEdges.forEach(edge => {
        const order = edge.data?.order || 0;
        [edge.source, edge.target].forEach(nodeId => {
             const foundNode = actorNodes.find(n => n.id === nodeId || n.id.toLowerCase() === nodeId.toLowerCase());
             const realId = foundNode ? foundNode.id : nodeId;

             if (!nodeActivity[realId]) {
                 nodeActivity[realId] = { min: order, max: order };
             } else {
                 nodeActivity[realId].min = Math.min(nodeActivity[realId].min, order);
                 nodeActivity[realId].max = Math.max(nodeActivity[realId].max, order);
             }
        });
    });

    actorNodes.forEach((node, index) => {
      node.position = {
        x: index * spacingX,
        y: 100 
      };
      
      const totalTimelineHeight = (maxOrder * stepHeight) + headerHeight + 50; 
      
      const activity = nodeActivity[node.id];
      const activationStart = activity ? (activity.min * stepHeight) + 30 : -1; 
      const activationEnd = activity ? (activity.max * stepHeight) + 50 : -1;

      node.data = { 
        ...node.data, 
        maxHeight: totalTimelineHeight,
        activationStart,
        activationEnd
      };
      
      node.sourcePosition = Position.Bottom;
      node.targetPosition = Position.Bottom;
    });

    if (titleNode) {
        const charCount = (titleNode.data.label || "").length;
        const textWidth = Math.max(600, charCount * 35);
        const graphWidth = (actorNodes.length - 1) * spacingX + THEME.dimensions.nodeWidth;
        const totalWidth = Math.max(graphWidth, textWidth);
        const centerOfActors = ((actorNodes.length - 1) * spacingX) / 2;
        
        titleNode.position = {
            x: centerOfActors - (totalWidth / 2),
            y: 0 
        };
        titleNode.style = { width: totalWidth, height: 200 };
    }

    const layoutedNodes = [...actorNodes];
    if (titleNode) layoutedNodes.push(titleNode);
    if (defsNode) layoutedNodes.push(defsNode);

    return { nodes: layoutedNodes, edges };
  }

  // Detect Backend Design Mode
  const isBackend = nodes.some(n => n.data?.diagramType === DiagramType.BACKEND_DESIGN);

  // --- STANDARD LAYOUT: ARCHITECTURE / ERD (DAGRE COMPOUND) ---

  if (!dagre || !dagre.graphlib) {
      console.warn("Dagre library not fully loaded, skipping layout.");
      return { nodes, edges };
  }

  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR' && !isBackend; // Force TB for Backend mostly

  // IMPROVEMENT: Increased spacing values to prevent overlap and make the diagram cleaner
  const RANK_SEP = isBackend ? 150 : (isHorizontal ? 300 : 250); // Increased Rank Separation
  const NODE_SEP = isBackend ? 100 : (isHorizontal ? 150 : 300);   // Increased Node Separation

  dagreGraph.setGraph({ 
    rankdir: isBackend ? 'TB' : direction,
    ranksep: RANK_SEP, 
    nodesep: NODE_SEP,  
    align: isBackend ? 'UL' : 'DL', 
    marginx: 150, // Increased margins
    marginy: 150,
    ranker: 'network-simplex' 
  });

  // Filter nodes
  const titleNode = nodes.find(n => n.type === 'title');
  const defsNode = nodes.find(n => n.type === 'defs');
  const layoutNodes = nodes.filter(n => n.type !== 'title' && n.type !== 'defs');

  if (layoutNodes.length === 0) {
      if (titleNode) titleNode.position = { x: 0, y: 0 };
      const resultNodes = [...(titleNode ? [titleNode] : []), ...(defsNode ? [defsNode] : [])];
      return { nodes: resultNodes, edges };
  }

  // 1. Add Nodes to Dagre
  layoutNodes.forEach((node) => {
    if (node.type !== 'group') {
        // Backend Design: Adjust dimensions for "Ports" (flat strips)
        const isPort = isBackend && node.data.variant === 'table';
        const w = isPort ? 200 : THEME.dimensions.nodeWidth;
        const h = isPort ? 60 : THEME.dimensions.nodeHeight;

        dagreGraph.setNode(node.id, { 
            width: w, 
            height: h 
        });
    } else {
        // For groups, we set minimal dimensions, allowing Dagre to expand them based on children
        // But we add padding to the logical dimensions so edges don't cut through the group border
        dagreGraph.setNode(node.id, { label: node.data.label, width: 150, height: 150 });
    }

    if (node.parentNode) {
        dagreGraph.setParent(node.id, node.parentNode);
    }
  });

  // 2. Add Edges
  edges.forEach((edge) => {
    const sourceExists = layoutNodes.some(n => n.id === edge.source);
    const targetExists = layoutNodes.some(n => n.id === edge.target);
    if (sourceExists && targetExists) {
        dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // 3. Compute Layout
  try {
      dagre.layout(dagreGraph);
  } catch (err) {
      console.error("Dagre Layout Error:", err);
      return { nodes, edges };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;

  // 4. Map positions back to Nodes
  let finalNodes = layoutNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    if (!nodeWithPosition) {
        return { ...node, position: { x: 0, y: 0 } };
    }

    let x = nodeWithPosition.x - (nodeWithPosition.width / 2);
    let y = nodeWithPosition.y - (nodeWithPosition.height / 2);

    // Calculate relative position for children
    if (node.parentNode) {
        const parentNode = dagreGraph.node(node.parentNode);
        if (parentNode) {
             const parentX = parentNode.x - (parentNode.width / 2);
             const parentY = parentNode.y - (parentNode.height / 2);
             x = x - parentX;
             y = y - parentY;
        }
    }

    if (node.type === 'group') {
         // Add padding to groups so nodes aren't touching the borders
         // INCREASED PADDING
         const PADDING = 80;
         node.style = {
             ...node.style,
             width: nodeWithPosition.width + PADDING,
             height: nodeWithPosition.height + PADDING
         };
         // Adjust group position to account for the padding added
         x = x - (PADDING / 2);
         y = y - (PADDING / 2);
    } else {
         node.targetPosition = isHorizontal ? Position.Left : Position.Top;
         node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    }

    node.position = { x, y };

    if (!node.parentNode) {
        const absX = nodeWithPosition.x - (nodeWithPosition.width / 2);
        const absY = nodeWithPosition.y - (nodeWithPosition.height / 2);
        if (absX < minX) minX = absX;
        if ((absX + nodeWithPosition.width) > maxX) maxX = absX + nodeWithPosition.width;
        if (absY < minY) minY = absY;
    }

    return node;
  });

  // --- BACKEND DESIGN POST-PROCESSING OVERRIDE ---
  // Enforce uniform width (660px) and vertical alignment for groups/nodes
  if (isBackend) {
      const UNIFORM_WIDTH = 660;
      
      finalNodes = finalNodes.map(node => {
          if (node.type === 'group') {
              return {
                  ...node,
                  style: {
                      ...node.style,
                      width: UNIFORM_WIDTH,
                  },
                  position: {
                      x: 0, 
                      y: node.position.y
                  }
              };
          }
          return node;
      });

      finalNodes = finalNodes.map(node => {
          if (node.parentNode) {
              const isPort = node.data.variant === 'table';
              const childWidth = isPort ? 200 : THEME.dimensions.nodeWidth;
              const centeredX = (UNIFORM_WIDTH / 2) - (childWidth / 2);
              
              return {
                  ...node,
                  position: {
                      ...node.position,
                      x: centeredX 
                  }
              };
          }
          return node;
      });
      
      minX = 0; 
      maxX = UNIFORM_WIDTH;
      finalNodes.forEach(node => {
           if (!node.parentNode) {
               const y = node.position.y;
               if (y < minY) minY = y;
           }
      });
  }

  if (minX === Infinity) { minX = 0; maxX = 0; minY = 0; }

  // 5. Position Title
  if (titleNode) {
    const graphWidth = (maxX - minX);
    const charCount = (titleNode.data.label || "").length;
    const textWidth = Math.max(800, charCount * 40); 
    const finalTitleWidth = Math.max(graphWidth, textWidth);
    
    const graphCenterX = minX + (graphWidth / 2);
    const titleX = graphCenterX - (finalTitleWidth / 2);
    
    titleNode.position = {
        x: Number.isFinite(titleX) ? titleX : 0,
        y: (Number.isFinite(minY) ? minY : 0) - 300 // Increased spacing for title
    };
    
    titleNode.style = { 
        width: finalTitleWidth,
        height: 200, 
        textAlign: 'center' 
    };
    
    finalNodes.push(titleNode);
  }

  if (defsNode) {
      finalNodes.push(defsNode);
  }

  return { nodes: finalNodes, edges };
};
