import './Book.scss'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { buyBook } from '../../services/user.service';


export default function Book({ book, key, user, onSelectBook }) {


   async function buyBookHandle(e) {
      e.stopPropagation();
      await buyBook(user.id, book.id)
   }

   return (
      <div className='Book' key={key} onClick={() => onSelectBook && onSelectBook(book)}>

         {user?.role && (
            <span className='warp-book-icon'>
               {user.role == "user" && <span className='book-icon' onClick={buyBookHandle}><AddShoppingCartIcon /></span>}
               {user.role == "admin" && <span className='book-icon'><EditIcon /></span>}
               {user.role == "admin" && <span className='book-icon'><DeleteIcon /></span>}
            </span>
         )}

         <div className='img-wrap  logo-spin'>
            <img src={book.src} />
         </div>
         <div className="book-details">
            <span className='name text-ellipsis-2'>{book.name}</span>
            <span className='author'>{book.author.name}</span>
         </div>
      </div>
   )
}