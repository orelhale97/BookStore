import { useEffect, useState } from 'react';
import './PublisherPage.scss'
import { fetchPublishers, createPublisher, updatePublisher, deletePublisher } from '../../services/admin.service';
import FormName from '../../components/FormName/FormName';
import { useAppContext } from '../../context/AppContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



export default function PublisherPage() {
   const { user } = useAppContext();

   const [publishers, setPublishers] = useState();
   const [editingPublisher, setEditingPublisher] = useState(null);

   useEffect(() => {
      fetchPublishers().then(setPublishers);
   }, [])


   async function editOrCreateHandle(publisherData) {
      try {
         if (editingPublisher) {
            const item = await updatePublisher(editingPublisher.id, publisherData);
            setPublishers((prev) => [...prev].map((publisher) => publisher.id === item.id ? item : publisher))
            setEditingPublisher("");
         } else {

            const item = await createPublisher(publisherData);
            setPublishers((prev) => [...prev, item]);
            setEditingPublisher(typeof editingPublisher == "string" ? null : "");
         }

      } catch (error) {
         console.error('Error saving publisher:', error);
      }
   }


   async function deleteHandle(id) {
      await deletePublisher(id).then(() => setPublishers((prev) => [...prev].filter((publisher) => publisher.id != id)))
   }

   if (!publishers) return (<p>No publisher found.</p>)

   return (<>
      {publishers &&
         <div className='PublisherPage'>
            {user?.role == "admin" && <FormName onSubmit={editOrCreateHandle} initialData={editingPublisher} />}

            <ul className="list">
               {publishers.map((item) => (
                  <li key={item.id} className="card">
                     {item.name}
                     {user?.role == "admin" && (
                        <div className='wrap-mui-icon'>
                           <span className='mui-icon' onClick={() => setEditingPublisher(item)}><EditIcon /></span>
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
