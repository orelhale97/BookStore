import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export default function AuthProvider({ children }) {

   const [user, setUser] = useState(null);

   useEffect(() => {
      getUserDetailsFromToken()
   }, []);


   function logout(error) {
      if (error) {
         console.log("Logout with error:", error);
      }

      localStorage.removeItem("token");
      setUser(null);
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

   async function login(email, password) {
      try {
         const request = await axios.post("./login", { email, password });
         const { token } = request.data;
         localStorage.token = token;
         getUserDetailsFromToken()
      } catch (error) {
         console.log("Login Failed ===== ", error);
         alert("Login Failed")
      }
   }


   return (
      <AuthContext.Provider value={{ login, logout, user }}>
         {children}
      </AuthContext.Provider>
   )

}


