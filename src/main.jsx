import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // THIS LINE FIXES EVERYTHING. IT WAS MISSING.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);