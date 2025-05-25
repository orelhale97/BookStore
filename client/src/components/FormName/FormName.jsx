import { useEffect, useState } from 'react';
import './FormName.scss'


export default function FormName({ initialData, onSubmit }) {

   const [formData, setFormData] = useState({ name: "", })
   const [errors, setErrors] = useState({});

   useEffect(() => {
      console.log("Initializing form data with object:", initialData);
      setFormData({ name: initialData?.name || "", });

   }, [initialData]);


   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      if (onSubmit) {
         const objectToSend = initialData ? { ...initialData, ...formData } : formData;
         console.log("handleSubmit =", { formData, objectToSend });
         onSubmit(objectToSend);
      }
   }

   const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) {
         newErrors.name = "The name is required";
      }

      formData.name = formData.name.trim();
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
         setErrors((prev) => ({ ...prev, [name]: null }));
      }
   };

   return (
      <div className='FormName'>
         <div>
            <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               placeholder="Purchase Name"
               className={errors.name ? "error" : ""}
            ></input>
            <button onClick={handleSubmit}>{initialData?.id ? "Edit" : "Add"}</button>
         </div>

         {errors.name && (<span className="text-error">{errors.name}</span>)}
      </div>
   )
}