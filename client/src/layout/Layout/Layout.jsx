import './Layout.scss'

import Header from '../Header/Header'
import HomePage from '../HomePage/HomePage'
import Sidebar from '../Sidebar/Sidebar'


export default function Layout() {


   return (
      <div className='Layout' key={'Layout'}>
         <Header />
         <HomePage />
         <Sidebar />
      </div>
   )
}