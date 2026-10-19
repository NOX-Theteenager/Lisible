import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
// Services (modules historiques qui exposent window.LisibleAPI, CVAI, CVAuth, CVStore…)
import './services/api.js';
import './services/extract.js';
import './services/store.js';
import './services/no-tics.js';
import './services/ai-adapter.js';
import './services/exporters.js';
import './services/i18n.js';
import './services/auth-adapter.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
