import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@library-frontend/ui/dist/style.css';
import AsyncBoundary from '@/AsyncBoundary';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AsyncBoundary>
      <App />
    </AsyncBoundary>
  </React.StrictMode>,
);
