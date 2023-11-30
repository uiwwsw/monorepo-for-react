import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@package-frontend/noto-emoji';
import '@package-frontend/pretendard';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
