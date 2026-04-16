import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Простой импорт App по умолчанию
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* Рендерится напрямую, без роутинга */}
  </React.StrictMode>
)
