import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/800.css'
import '@fontsource/noto-sans-georgian/400.css'
import '@fontsource/noto-sans-georgian/600.css'
import '@fontsource/noto-sans-georgian/800.css'
import './index.css'
import App from './App.jsx'
import { store } from './store'
import { LangProvider } from './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LangProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LangProvider>
    </Provider>
  </StrictMode>,
)
