import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Aggressively suppress ResizeObserver loop errors
// These are benign in React Flow but can crash the app or spam console if unhandled
const originalError = console.error;
const SUPPRESSED_ERRORS = [
  'ResizeObserver loop',
  'ResizeObserver limit',
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded',
  'ResizeObserver' 
];

const isSuppressed = (msg: string) => {
    if (!msg) return false;
    const lowerMsg = msg.toLowerCase();
    return SUPPRESSED_ERRORS.some(err => lowerMsg.includes(err.toLowerCase()));
};

console.error = (...args) => {
  // Convert args to string to check for suppression
  const msg = args.map(arg => 
    typeof arg === 'object' && arg !== null 
        ? (arg.message || arg.toString()) 
        : String(arg)
  ).join(' ');

  if (isSuppressed(msg)) {
    return;
  }
  originalError.call(console, ...args);
};

window.addEventListener('error', (e) => {
  const msg = e.message || (e.error && e.error.message) || '';
  if (isSuppressed(msg)) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Also suppress unhandled rejections if they wrap this error
window.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || String(e.reason);
  if (isSuppressed(msg)) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);