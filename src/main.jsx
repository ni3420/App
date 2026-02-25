import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store} from "./store/store.js"
import MainLayout from "./Components/MainLayout.jsx"
import { BrowserRouter, } from 'react-router-dom'
import { Home } from 'lucide-react'
import AuthLayout from './Components/AuthLayout.jsx'
import LoginPage from "./Pages/LoginPage.jsx"
import Sign_up from "./Pages/Sign_up.jsx"
import AllPost from "./PostPages/AllPost.jsx"
import Messages from './Pages/Messages.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
        <App/>
        </BrowserRouter> 
    </Provider>

    
  </StrictMode>,
)
