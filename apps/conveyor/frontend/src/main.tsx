import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/App';
import 'src/index.css';
import '@library-frontend/ui/dist/style.css';
import AsyncBoundary from '@/AsyncBoundary';
import 'src/i18n';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AsyncBoundary>
      <App />
    </AsyncBoundary>
  </React.StrictMode>,
);
