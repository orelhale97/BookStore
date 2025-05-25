import './Layout.scss'

import Header from '../Header/Header'
import Main from '../Main/Main'
import Sidebar from '../Sidebar/Sidebar'
import { useAppContext } from '../../context/AppContext'
import Popup from '../../components/Popup/Popup'



export default function Layout() {

   const { showPopup, setShowPopup } = useAppContext()

   return (
      <div className='Layout' key={'Layout'}>
         <Header />
         <div className='app-container'>
            <Sidebar />
            <Main />
         </div>

         {showPopup && <Popup onClose={() => setShowPopup(null)}>{showPopup}</Popup>}
      </div>
   )
}