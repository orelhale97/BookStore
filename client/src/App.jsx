import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppContext from './context/AppContext'
import Layout from './layout/Layout/Layout'

function App() {

   return (
      <BrowserRouter>
         <AppContext>
            <Layout />
         </AppContext>
      </BrowserRouter>
   )
}

export default App
