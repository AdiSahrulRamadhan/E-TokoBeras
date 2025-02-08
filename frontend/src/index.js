import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18
import './App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot instead of render
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
