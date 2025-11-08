import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Or whatever your main component is
import './index.css'; // This is the new line you just added

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
