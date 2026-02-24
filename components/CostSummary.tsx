
import React from 'react';
import { DollarSign, X, TrendingUp, CreditCard, PieChart, Download } from 'lucide-react';

interface CostItem {
    label: string;
    cost: number;
    tech: string;
}

interface CostSummaryProps {
    breakdown: CostItem[];
    total: number;
    onClose: () => void;
}

const CostSummary: React.FC<CostSummaryProps> = ({ breakdown, total, onClose }) => {
    
    // Sort by cost desc
    const sorted = [...breakdown].sort((a, b) => b.cost - a.cost);

    const handleDownloadCSV = () => {
        const headers = "Component,Technology,Monthly Cost (USD)\n";
        const rows = sorted.map(item => `"${item.label}","${item.tech}",${item.cost}`).join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows + `\n"TOTAL","",${total}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cloud_cost_estimate.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="absolute top-20 left-20 w-96 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden z-[4000] animate-in slide-in-from-left-10 fade-in duration-300 flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                        <DollarSign className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">FinOps Estimate</h3>
                        <p className="text-xs text-emerald-400/80">Monthly Cloud Infrastructure</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Total Big Number */}
            <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Total Cost of Ownership</span>
                <div className="text-4xl font-extrabold text-white flex items-center justify-center gap-1">
                    <span className="text-emerald-500 text-2xl">$</span>
                    {total.toLocaleString()}
                    <span className="text-slate-500 text-lg font-medium">/mo</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                    <span className="text-[10px] text-slate-400">~ ${(total * 12).toLocaleString()}/yr</span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sorted.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No cost-incurring components detected.
                    </div>
                ) : (
                    sorted.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg group transition-colors border border-transparent hover:border-slate-700">
                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-xs font-bold text-slate-200 truncate" title={item.label}>{item.label}</span>
                                <span className="text-[10px] text-slate-500 truncate">{item.tech}</span>
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-300 whitespace-nowrap">
                                ${item.cost}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                <button 
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                >
                    <Download className="w-3 h-3" />
                    Export CSV
                </button>
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                    <PieChart className="w-3 h-3" />
                    <span>Est. based on public pricing</span>
                </div>
            </div>
        </div>
    );
};

export default CostSummary;
