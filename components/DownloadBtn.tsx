import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import { FileJson, Image as ImageIcon, FileCode, Film, Loader2, ScrollText, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { toMermaid } from '../utils/mermaidExport';

const downloadFile = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', dataUrl);
  a.click();
};

const DownloadBtn = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Helper to generate filename from Title Node
  const getFilePrefix = () => {
      const nodes = getNodes();
      const titleNode = nodes.find(n => n.type === 'title');
      if (titleNode?.data?.label) {
          return titleNode.data.label
            .replace(/[^a-z0-9\s\-_]/gi, '') // Remove special chars
            .trim()
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .toLowerCase();
      }
      return 'flowgen-diagram';
  };

  // Improved Bounds Calculation - MANUAL ITERATION
  const getGraphBounds = () => {
    const nodes = getNodes().filter(n => !n.hidden && n.type !== 'defs' && n.type !== 'background');
    
    if (nodes.length === 0) return { x: 0, y: 0, width: 800, height: 600 };

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
        const x = node.position.x;
        const y = node.position.y;
        
        let w = (node.style?.width as number) || (node as any).measured?.width || (node.width as number) || 200;
        let h = (node.style?.height as number) || (node as any).measured?.height || (node.height as number) || 100;

        // Title Node needs significantly more padding for the 3xl blur/glow effects
        if (node.type === 'title') {
             minX = Math.min(minX, x - 150); 
             maxX = Math.max(maxX, x + w + 150);
             minY = Math.min(minY, y - 150); 
             maxY = Math.max(maxY, y + h + 150); 
        } else {
             minX = Math.min(minX, x);
             minY = Math.min(minY, y);
             maxX = Math.max(maxX, x + w);
             maxY = Math.max(maxY, y + h);
        }
    });

    const PADDING = 80;

    const finalX = minX - PADDING;
    const finalY = minY - PADDING;
    const finalWidth = (maxX - minX) + (PADDING * 2);
    const finalHeight = (maxY - minY) + (PADDING * 2);

    // Ensure strictly positive dimensions
    return {
        x: finalX,
        y: finalY,
        width: Math.max(finalWidth, 100),
        height: Math.max(finalHeight, 100),
    };
  };

  const getExportOptions = (bounds: { x: number, y: number, width: number, height: number }, pixelRatio = 1.5) => {
      const { width, height, x, y } = bounds;
      
      return {
          width: width,
          height: height,
          backgroundColor: '#0f172a', // Critical: Set explicit background color for canvas
          style: {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${-x}px, ${-y}px)`,
            backgroundColor: '#0f172a',
            backgroundImage: `
                radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%),
                linear-gradient(30deg, #475569 1px, transparent 1px), 
                linear-gradient(150deg, #475569 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            backgroundPosition: 'center, 0 0, 0 0',
            backgroundRepeat: 'no-repeat, repeat, repeat'
          },
          pixelRatio: pixelRatio, 
      };
  };

  const handleDownloadImage = async (format: 'png' | 'svg') => {
    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportElement) return;

    const bounds = getGraphBounds();
    const options = getExportOptions(bounds);

    try {
        const filename = `${getFilePrefix()}.${format}`;
        if (format === 'png') {
            const dataUrl = await toPng(viewportElement, options);
            downloadFile(dataUrl, filename);
        } else {
            const dataUrl = await toSvg(viewportElement, options);
            downloadFile(dataUrl, filename);
        }
    } catch (err) {
        console.error('Export failed', err);
        // Suppress benign ResizeObserver errors from triggering the alert
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.toLowerCase().includes('resizeobserver')) {
            alert('Failed to export image. Please try again.');
        }
    }
  };

  const handleGifExport = async () => {
      const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) return;

      setIsExportingGif(true);

      try {
          const workerBlob = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
            .then(resp => resp.blob());
          const workerUrl = URL.createObjectURL(workerBlob);

          // Calculate bounds FIRST to set explicit dimensions
          const bounds = getGraphBounds();
          const options = getExportOptions(bounds, 1); // Use pixelRatio 1 for GIFs to save size

          // @ts-ignore
          const gif = new window.GIF({
            workers: 2,
            quality: 10,
            workerScript: workerUrl,
            background: '#0f172a',
            width: bounds.width, // Explicit width
            height: bounds.height, // Explicit height
            transparent: null // Ensure no transparency issues
          });

          const frames = 20; 
          
          for (let i = 0; i < frames; i++) {
              const dataUrl = await toPng(viewportElement, options);
              
              const img = new Image();
              
              // Wrap image loading in a promise that handles both load and error
              await new Promise<void>((resolve, reject) => {
                  img.onload = () => resolve();
                  img.onerror = (e) => {
                      console.error("Frame load error", e);
                      // Resolve anyway to skip bad frame rather than crash
                      resolve();
                  };
                  img.src = dataUrl;
              });

              if (img.width === 0 || img.height === 0) {
                  continue; 
              }

              gif.addFrame(img, { delay: 100 }); 
              await new Promise(r => setTimeout(r, 100)); // Delay between captures
          }

          gif.on('finished', (blob: Blob) => {
              const url = URL.createObjectURL(blob);
              downloadFile(url, `${getFilePrefix()}.gif`);
              setIsExportingGif(false);
          });

          gif.render();

      } catch (err) {
          console.error("GIF Generation Error", err);
          const msg = err instanceof Error ? err.message : String(err);
          if (!msg.toLowerCase().includes('resizeobserver')) {
              alert(`Could not generate GIF: ${msg}`);
          }
          setIsExportingGif(false);
      }
  };

  const exportJson = () => {
      const flow = {
          nodes: getNodes(),
          edges: getEdges(),
          viewport: { x: 0, y: 0, zoom: 1 }
      };
      
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(flow, null, 2)
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `${getFilePrefix()}.json`;
      link.click();
  };

  const exportMermaid = () => {
      const nodes = getNodes();
      const edges = getEdges();
      const mermaidString = toMermaid(nodes, edges, 'LR');
      const blob = new Blob([mermaidString], { type: 'text/vnd.mermaid' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${getFilePrefix()}.mmd`;
      link.click();
  };

  return (
    <div className="download-btn absolute top-2 right-2 sm:top-4 sm:right-4 z-[3000] flex flex-col items-end pointer-events-none">
       {/* Toggle Button */}
       <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="pointer-events-auto bg-slate-900 border border-slate-700 text-slate-400 p-1.5 rounded-full hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all mb-2 shadow-lg"
          title={isCollapsed ? "Show Export Options" : "Hide Export Options"}
       >
          {isCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
       </button>

       {/* Content */}
       <div className={`
            bg-slate-900/80 backdrop-blur-md border border-slate-700 p-1.5 rounded-xl shadow-2xl flex gap-1 pointer-events-auto items-center origin-top-right transition-all duration-300
            ${isCollapsed ? 'opacity-0 scale-90 translate-x-10 pointer-events-none' : 'opacity-100 scale-100 translate-x-0'}
       `}>
            <button
                onClick={() => handleDownloadImage('png')}
                disabled={isExportingGif}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors group relative disabled:opacity-50 border border-transparent hover:border-slate-600"
                title="Export as PNG"
            >
                <ImageIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => handleDownloadImage('svg')}
                disabled={isExportingGif}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors disabled:opacity-50 border border-transparent hover:border-slate-600"
                title="Export as SVG"
            >
                <FileCode className="w-5 h-5" />
            </button>
             <button
                onClick={handleGifExport}
                disabled={isExportingGif}
                className={`w-9 h-9 flex items-center justify-center hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-slate-600 ${isExportingGif ? 'text-indigo-400' : 'text-slate-400 hover:text-pink-400'}`}
                title="Export Animation as GIF"
            >
                {isExportingGif ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
            </button>
            <div className="w-px bg-slate-700/50 my-1 h-5"></div>
            <button
                onClick={exportMermaid}
                disabled={isExportingGif}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50 border border-transparent hover:border-slate-600"
                title="Export as Mermaid (Diagram as Code)"
            >
                <ScrollText className="w-5 h-5" />
            </button>
            <button
                onClick={exportJson}
                disabled={isExportingGif}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors disabled:opacity-50 border border-transparent hover:border-slate-600"
                title="Export JSON"
            >
                <FileJson className="w-5 h-5" />
            </button>
       </div>
    </div>
  );
};

export default DownloadBtn;