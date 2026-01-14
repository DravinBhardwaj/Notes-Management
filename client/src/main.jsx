import React from "react";
// Import the ReactDOM library from node_modules of the CLIENT project
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <App />
  </BrowserRouter>
)
