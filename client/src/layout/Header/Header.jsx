import { useNavigate } from 'react-router-dom';
import LogIn from '../../components/LogIn/LogIn'
import Register from '../../components/Register/Register'
import { useAppContext } from '../../context/AppContext';
import './Header.scss'


export default function Header() {
   const { setToken, setShowPopup, user } = useAppContext();

   const navigate = useNavigate();

   function onUserRegistered() {
      setShowPopup(<LogIn />)
   }

   function onUserLoggedIn(token) {
      setToken(token)
   }

   return (
      <header className="Header">
         <div className="logo" onClick={() => navigate("/")}>📚 Book Store</div>

         {!user ?
            <div className='header-btn'>
               <button className="login-button" onClick={() => setShowPopup(<LogIn onUserLoggedIn={onUserLoggedIn} />)}>LogIn</button>
               <button className="login-button" onClick={() => setShowPopup(<Register onUserRegistered={onUserRegistered} />)}>Register</button>
            </div>
            : <r className='user-name'>{user.name}</r>
         }
      </header>
   )
}