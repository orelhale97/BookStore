import LogIn from '../../components/LogIn/LogIn'
import Register from '../../components/Register/Register'
import { useAuth } from '../../context/AuthContext';
import './Header.scss'


export default function Header() {
   const { setToken, setShowPopup } = useAuth();


   function onUserRegistered() {
      setShowPopup(<LogIn />)
   }
   function onUserLoggedIn(token) {
      setToken(token)
   }

   return (
      <header className="Header">
         <div className="logo">📚 BookNest</div>

         <div>
            <button className="login-button" onClick={() => setShowPopup(<LogIn onUserLoggedIn={onUserLoggedIn} />)}>LogIn</button>
            <button className="login-button" onClick={() => setShowPopup(<Register onUserRegistered={onUserRegistered} />)}>Register</button>
         </div>
      </header>
   )
}