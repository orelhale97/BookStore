import { useEffect, useState } from 'react'
import './AuthorsPage.scss'
import { createAuthors, deleteAuthor, fetchAuthors, updateAuthors } from '../../services/admin.service'
import { useAppContext } from '../../context/AppContext';
import FormName from '../../components/FormName/FormName';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function AuthorsPage() {
   const { user } = useAppContext();

   const [authors, setAuthors] = useState();
   const [editingAuthor, setEditingAuthor] = useState(null);

   useEffect(() => {
      fetchAuthors().then(setAuthors);
   }, [])


   async function editOrCreateHandle(authorData) {
      try {
         if (editingAuthor) {
            const item = await updateAuthors(editingAuthor.id, authorData);
            setAuthors((prev) => [...prev].map((author) => author.id === item.id ? item : author))
            setEditingAuthor("");
         } else {

            const item = await createAuthors(authorData);
            setAuthors((prev) => [...prev, item]);
            setEditingAuthor(typeof editingAuthor == "string" ? null : "");
         }

      } catch (error) {
         console.error('Error saving author:', error);
      }
   }


   async function deleteHandle(id) {
      await deleteAuthor(id).then(() => setAuthors((prev) => [...prev].filter((author) => author.id != id)))
   }



   if (!authors) return (<p>No authors found.</p>)

   return (<>
      {authors &&
         <div className='AuthorsPage'>
            {user?.role == "admin" && <FormName onSubmit={editOrCreateHandle} initialData={editingAuthor} />}

            <ul className="list">
               {authors.map((item) => (
                  <li key={item.id} className="card">
                     {item.name}
                     {user?.role == "admin" && (
                        <div className='wrap-mui-icon'>
                           <span className='mui-icon' onClick={() => setEditingAuthor(item)}><EditIcon /></span>
                           <span className='mui-icon' onClick={() => deleteHandle(item.id)}><DeleteIcon /></span>
                        </div>
                     )}
                  </li>
               ))}
            </ul>
         </div>
      }
   </>)
}