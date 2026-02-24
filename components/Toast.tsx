
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10',
    info: 'border-blue-500/30 bg-blue-500/10'
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl 
      animate-in slide-in-from-right-10 fade-in duration-300 w-full sm:w-80 pointer-events-auto
      ${borders[toast.type]}
    `}>
      <div className="mt-0.5 shrink-0">
        {icons[toast.type]}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-100">{toast.title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed z-[9999] flex flex-col gap-3 pointer-events-none left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
