import './LogIn.scss'
import { useEffect, useState } from 'react';
import { login } from '../../services/user.service';


export default function LogIn({ onUserLoggedIn }) {

   const [form, setForm] = useState({ email: '', password: '' });
   const [error, setError] = useState('');


   useEffect(() => {
      const obj = {
         email: `test@gmail.com`,
         name: "test",
         password: "1234"
      }
      setForm(obj)
   }, [])


   async function handleSubmit(e) {
      e.preventDefault();
      if (error) setError("")

      try {
         const data = await login(form);
         onUserLoggedIn(data.token);
      } catch (err) {
         console.log("err =", err);
         setError("Invalid email or password.");
      }
   };


   const formList = [
      { key: "email", type: "email", placeholder: "Email", },
      { key: "password", type: "password", placeholder: "Password", },
   ]


   return (
      <div className='LogIn'>
         <h2>Login</h2>
         <form onSubmit={handleSubmit}>

            {formList.map(({ key, type, placeholder }) =>
               <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
               />
            )}

            <button type="submit">Log In</button>

            {error && <p className='text-error'>{error}</p>}
         </form>
      </div>
   )
}