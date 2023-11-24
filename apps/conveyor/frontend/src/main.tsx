import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@library-frontend/ui/dist/style.css';
import '@package-frontend/noto-emoji/notoemojivariable.css';
import '@package-frontend/pretendard/pretendardvariable.css';
import AsyncBoundary from '@/AsyncBoundary';
import './i18n';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AsyncBoundary>
      <App />
    </AsyncBoundary>
  </React.StrictMode>,
);
