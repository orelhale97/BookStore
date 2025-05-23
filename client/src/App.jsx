import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AuthProvider from './context/AuthContext'
import Layout from './layout/Layout/Layout'

function App() {

   return (
      <BrowserRouter>
         <AuthProvider>
            <Layout />
         </AuthProvider>
      </BrowserRouter>
   )
}

export default App
