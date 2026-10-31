import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { dataService } from './db';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Écouter le retour en ligne pour synchroniser automatiquement la file d'attente
window.addEventListener('online', () => {
  void dataService.autoSyncOnOnline();
});

