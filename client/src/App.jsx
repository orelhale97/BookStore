import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AuthProvider from './context/AuthContext'
import Layout from './layout/Layout/Layout'

function App() {

   return (
      <AuthProvider>
         <BrowserRouter>
            <Layout />
         </BrowserRouter>
      </AuthProvider>
   )
}

export default App
