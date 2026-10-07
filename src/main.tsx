import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global protection against third-party iframe / audio autoplay unhandled rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Gracefully handle browser audio autoplay policies or iframe message rejections
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Suppress cross-origin script errors that lack context
    if (!event.message || event.message === 'Script error.' || event.message.includes('Uncaught')) {
      if (event.filename && !event.filename.includes(window.location.host)) {
        event.preventDefault();
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
