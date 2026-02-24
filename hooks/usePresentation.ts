
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Node, Edge, ReactFlowInstance } from 'reactflow';
import { NodeData } from '../types';
import { THEME } from '../theme';

export type PresentationStrategy = 'dfs' | 'bfs' | 'coordinate';

interface UsePresentationProps {
    nodes: Node<NodeData>[];
    edges: Edge[];
    rfInstance: ReactFlowInstance | null;
    setSelectedNode: (node: Node<NodeData> | null) => void;
    setIsReadOnly: (isReadOnly: boolean) => void;
    handleFitView: () => void;
    addToast: (title: string, msg: string, type: 'info' | 'error' | 'warning') => void;
}

export const usePresentation = ({ 
    nodes, 
    edges, 
    rfInstance, 
    setSelectedNode, 
    setIsReadOnly, 
    handleFitView,
    addToast 
}: UsePresentationProps) => {
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [presentationStep, setPresentationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [strategy, setStrategy] = useState<PresentationStrategy>('dfs');
    const presentationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // --- TRAVERSAL ALGORITHMS ---

    // 1. DFS (Trace the path deeply)
    const getDFSNodes = (candidates: Node[], edges: Edge[]): Node[] => {
        const outEdges: Record<string, Node[]> = {};
        const inDegree: Record<string, number> = {};
        
        candidates.forEach(n => { outEdges[n.id] = []; inDegree[n.id] = 0; });
        edges.forEach(e => {
            const s = candidates.find(c => c.id === e.source);
            const t = candidates.find(c => c.id === e.target);
            if (s && t) { outEdges[s.id].push(t); inDegree[t.id] = (inDegree[t.id] || 0) + 1; }
        });

        // Sort children visually for consistent branch selection
        const sortVisually = (a: Node, b: Node) => {
            const pa = a.position.y;
            const pb = b.position.y;
            return (pa - pb) || (a.position.x - b.position.x);
        };

        let roots = candidates.filter(n => inDegree[n.id] === 0).sort(sortVisually);
        
        // Handle cycles
        if (roots.length === 0 && candidates.length > 0) roots = [candidates[0]];

        const sorted: Node[] = [];
        const visited = new Set<string>();

        const dfs = (node: Node) => {
            if (visited.has(node.id)) return;
            visited.add(node.id);
            sorted.push(node);
            const children = outEdges[node.id].sort(sortVisually);
            children.forEach(dfs);
        };

        roots.forEach(root => dfs(root));
        
        // Add disconnected
        candidates.filter(n => !visited.has(n.id)).sort(sortVisually).forEach(n => sorted.push(n));
        return sorted;
    };

    // 2. BFS (Layer by Layer)
    const getBFSNodes = (candidates: Node[], edges: Edge[]): Node[] => {
        const outEdges: Record<string, Node[]> = {};
        const inDegree: Record<string, number> = {};
        
        candidates.forEach(n => { outEdges[n.id] = []; inDegree[n.id] = 0; });
        edges.forEach(e => {
            const s = candidates.find(c => c.id === e.source);
            const t = candidates.find(c => c.id === e.target);
            if (s && t) { outEdges[s.id].push(t); inDegree[t.id] = (inDegree[t.id] || 0) + 1; }
        });

        // Visually sort helper
        const sortVisually = (a: Node, b: Node) => (a.position.y - b.position.y) || (a.position.x - b.position.x);

        let roots = candidates.filter(n => inDegree[n.id] === 0).sort(sortVisually);
        if (roots.length === 0 && candidates.length > 0) roots = [candidates[0]];

        const sorted: Node[] = [];
        const visited = new Set<string>();
        const queue: Node[] = [...roots];

        roots.forEach(r => visited.add(r.id));

        while(queue.length > 0) {
            const current = queue.shift()!;
            sorted.push(current);

            const children = outEdges[current.id].sort(sortVisually);
            children.forEach(child => {
                if (!visited.has(child.id)) {
                    visited.add(child.id);
                    queue.push(child);
                }
            });
        }

        candidates.filter(n => !visited.has(n.id)).sort(sortVisually).forEach(n => sorted.push(n));
        return sorted;
    };

    // 3. Coordinate (Reading Order: Left-to-Right, Top-to-Bottom)
    const getCoordinateNodes = (candidates: Node[]): Node[] => {
        return [...candidates].sort((a, b) => {
            const ax = a.position.x + (a.parentNode ? 1000 : 0); // slight grouping weight
            const bx = b.position.x + (b.parentNode ? 1000 : 0);
            
            // Primary sort X (Columns), Secondary sort Y (Rows)
            // Allow some tolerance for "columns" (e.g. within 50px is same column)
            if (Math.abs(ax - bx) > 100) return ax - bx;
            return a.position.y - b.position.y;
        });
    };

    const presentationNodes = useMemo(() => {
        const candidates = nodes.filter(n => 
            n.type !== 'title' && 
            n.type !== 'defs' && 
            n.type !== 'group' && 
            !n.hidden
        );

        if (candidates.length === 0) return [];

        switch (strategy) {
            case 'bfs': return getBFSNodes(candidates, edges);
            case 'coordinate': return getCoordinateNodes(candidates);
            case 'dfs':
            default: return getDFSNodes(candidates, edges);
        }
    }, [nodes, edges, strategy]);

    const focusOnStep = useCallback((idx: number) => {
        if (!rfInstance || presentationNodes.length === 0) return;
        const targetNode = presentationNodes[idx];
        if (!targetNode) return;

        setSelectedNode(targetNode as Node<NodeData>);
        
        const x = targetNode.position.x + (THEME.dimensions.nodeWidth / 2);
        const y = targetNode.position.y + (THEME.dimensions.nodeHeight / 2);
        
        let absoluteX = x;
        let absoluteY = y;
        
        if (targetNode.parentNode) {
            const parent = nodes.find(n => n.id === targetNode.parentNode);
            if (parent) {
                absoluteX += parent.position.x;
                absoluteY += parent.position.y;
            }
        }

        rfInstance.setCenter(absoluteX, absoluteY, { zoom: 1.5, duration: 1000 });
    }, [rfInstance, presentationNodes, nodes, setSelectedNode]);

    const startPresentation = () => {
        if (presentationNodes.length === 0) {
            addToast("Empty Presentation", "No nodes to present.", "warning");
            return;
        }
        setIsPresentationMode(true);
        setIsReadOnly(true);
        setPresentationStep(0);
        focusOnStep(0);
        addToast("Presentation Mode", "Starting slideshow...", "info");
    };

    const stopPresentation = () => {
        setIsPresentationMode(false);
        setIsPlaying(false);
        setSelectedNode(null);
        if (presentationInterval.current) clearInterval(presentationInterval.current);
        handleFitView(); 
    };

    const nextSlide = useCallback(() => {
        setPresentationStep(prev => {
            const next = (prev + 1) % presentationNodes.length;
            focusOnStep(next);
            return next;
        });
    }, [presentationNodes.length, focusOnStep]);

    const prevSlide = useCallback(() => {
        setPresentationStep(prev => {
            const next = prev - 1 < 0 ? presentationNodes.length - 1 : prev - 1;
            focusOnStep(next);
            return next;
        });
    }, [presentationNodes.length, focusOnStep]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) addToast("Auto-Play", "Slideshow started.", "info");
        else addToast("Paused", "Slideshow paused.", "info");
    };

    const changeStrategy = (newStrategy: PresentationStrategy) => {
        setStrategy(newStrategy);
        setPresentationStep(0); // Reset to start
        setIsPlaying(false);
        // We need to wait for useMemo to update before focusing, 
        // but since we reset index to 0, the next render will handle it if we are careful.
        // Or simply let the user click next.
        addToast("Strategy Changed", `Switched to ${newStrategy.toUpperCase()} order.`, "info");
    };

    useEffect(() => {
        if (isPlaying && isPresentationMode) {
            presentationInterval.current = setInterval(nextSlide, 3500); 
        } else {
            if (presentationInterval.current) clearInterval(presentationInterval.current);
        }
        return () => { if (presentationInterval.current) clearInterval(presentationInterval.current); };
    }, [isPlaying, isPresentationMode, nextSlide]);

    // Re-focus on step 0 when strategy changes
    useEffect(() => {
        if(isPresentationMode) {
            focusOnStep(0);
        }
    }, [strategy]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isPresentationMode,
        isPlaying,
        presentationStep,
        startPresentation,
        stopPresentation,
        togglePlay,
        nextSlide,
        prevSlide,
        strategy,
        setStrategy: changeStrategy
    };
};
