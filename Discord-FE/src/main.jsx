import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import './index.css'
import { store } from "./redux/store"
import App from './App.jsx'
import { ThemeProvider } from './components/layout/ThemeProvider.js'

if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
