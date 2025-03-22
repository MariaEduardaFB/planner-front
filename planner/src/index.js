import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualizado para React 18
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Cria a raiz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
