import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import PlayerContextProvider from './context/PlayerContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
    <PlayerContextProvider>
      <App />
    </PlayerContextProvider>
    </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
