import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// developers ko greet karne ke liye console message set kiya (Hinglish comments)
console.log('%c📈 InvesTrack PRO Engine Active!', 'color: #000; font-weight: bold; font-size: 14px; background: #e2e8f0; padding: 4px 8px; border: 2px solid #000; border-radius: 4px; box-shadow: 2px 2px 0px #000;');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
