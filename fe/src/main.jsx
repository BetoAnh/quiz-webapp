import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="max-w-5xl mx-auto h-full bg-white">
      <App />
    </div>
  </StrictMode>,
)
