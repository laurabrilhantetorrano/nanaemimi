import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // 1. Mudamos de Inicio para App aqui

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* 2. Renderizamos o componente App, que agora é o ponto de entrada da aplicação */}
  </StrictMode>,
)