import './Layout.scss'

import Header from '../Header/Header'
import HomePage from '../HomePage/HomePage'
import Sidebar from '../Sidebar/Sidebar'
import { Navigate, Route, Router, Routes } from 'react-router-dom'


export default function Layout() {


   return (
      <div className='Layout' key={'Layout'}>
         <Header />
         <div className='app-container'>
            <Sidebar />

            <div className='app-main'>
               <Routes>
                  <Route path="/" element={<Navigate to="/books" replace />} />
                  <Route path="books" element={<HomePage />} />
                  <Route path="*" element={<h1 style={{ color: "red", textAlign: "center", marginTop: "200px" }}>Page not found</h1>} />
               </Routes>
            </div>
         </div>
      </div>
   )
}