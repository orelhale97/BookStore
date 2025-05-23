import './Layout.scss'

import Header from '../Header/Header'
import Main from '../Main/Main'
import Sidebar from '../Sidebar/Sidebar'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Popup from '../../components/Popup/Popup'


export default function Layout() {

   const { showPopup, setShowPopup } = useAuth()

   return (
      <div className='Layout' key={'Layout'}>
         <Header />
         <div className='app-container'>
            <Sidebar />

            <div className='app-main'>
               <Routes>
                  <Route path="/" element={<Navigate to="/books" replace />} />
                  <Route path="books" element={<Main />} />
                  <Route path="*" element={<h1 style={{ color: "red", textAlign: "center", marginTop: "200px" }}>Page not found</h1>} />
               </Routes>
            </div>
         </div>

         {showPopup && <Popup onClose={() => setShowPopup(null)}>{showPopup}</Popup>}
      </div>
   )
}