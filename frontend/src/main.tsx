import { StrictMode } from 'react'
import { JSXToHTML } from './core'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

window.JSXToHTML = JSXToHTML;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
