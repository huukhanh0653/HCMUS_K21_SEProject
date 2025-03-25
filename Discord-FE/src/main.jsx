import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/layout/ThemeProvider.js'

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
)
