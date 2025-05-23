import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export default function AuthProvider({ children }) {

   const [user, setUser] = useState(null);
   const [showPopup, setShowPopup] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      getUserDetailsFromToken()
   }, []);


   function logout(error) {
      if (error) {
         console.log("Logout with error:", error);
      }

      localStorage.removeItem("token");
      setUser(null);

      navigate("/")
   };


   function getUserDetailsFromToken() {
      const token = localStorage.getItem("token");
      if (token) {
         try {
            const decoded = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now()

            isExpired ? logout() : setUser(decoded);
         } catch (error) {
            logout(error);
         }
      }
   }

   function setToken(token) {
      localStorage.token = token;
      getUserDetailsFromToken();
      navigate("/");
      setShowPopup(null);
   }


   return (
      <AuthContext.Provider value={{ setToken, logout, user, showPopup, setShowPopup }}>
         {children}
      </AuthContext.Provider>
   )

}


