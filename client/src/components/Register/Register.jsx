import './Register.scss'
import { useState } from 'react';
import { register } from '../../services/user.service';

export default function Register({ onUserRegistered }) {

   const [form, setForm] = useState({ email: '', name: '', password: '' });
   const [error, setError] = useState('');

   const validate = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameValid = form.name.trim().length > 0;
      const passwordValid = /^[a-zA-Z0-9]+$/.test(form.password) && !form.password.includes(' ');

      if (!emailRegex.test(form.email)) return "Invalid email format.";
      if (!nameValid) return "Name must contain at least one non-space character.";
      if (!passwordValid) return "Password must contain only letters or numbers, no spaces.";
      return "";
   };

   async function handleSubmit(e) {
      e.preventDefault();
      const validationError = validate();

      if (validationError) return setError(validationError);
      if (error) setError("")

      try {
         await register(form);

         if (onUserRegistered) onUserRegistered();
      } catch (error) {
         console.log("error =", error);
         setError((error.status === 409) ? "This email is already exists" : "Registration failed.");
      }
   };

   const formList = [
      { key: "email", type: "email", placeholder: "Email", },
      { key: "name", type: "text", placeholder: "Name", },
      { key: "password", type: "password", placeholder: "Password", },
   ]

   return (
      <div className='Register'>
         <h2>Register</h2>

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

            <button type="submit">Sign In</button>

            {error && <p className='text-error'>{error}</p>}
         </form>
      </div>
   );
}