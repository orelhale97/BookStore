import { useAppContext } from '../../context/AppContext';
import './Sidebar.scss'
import { useLocation, useNavigate } from 'react-router-dom';


export default function Sidebar() {
   const { user, logout } = useAppContext();
   const location = useLocation();
   const navigate = useNavigate();

   function isActive(path) {
      return (location.pathname === path || location.pathname.startsWith(path)) ? 'active' : '';
   }

   const sidebarList = [
      { icon: "📚", content: "Books", path: "/books" },
      { role: ["user"], icon: "🛒", content: "Purchase History", path: "/history" },
      { icon: "✍️", content: "Authors", path: "/authors" },
      { icon: "🏢", content: "Publishers", path: "/publishers" },
      { role: ["user", "admin"], icon: "🚪", content: "Logout", onClick: logout },
   ];



   return (
      <div className="Sidebar">
         {sidebarList.map(({ role, icon, content, path, onClick }, index) => (
            ((!role) || (role && user?.role && role.includes(user.role))) ? (
               <button key={index + "sidebar"} className={isActive(path)} onClick={() => onClick ? onClick() : navigate(path)}>
                  {icon} {content}
               </button>
            ) : <></>
         ))}
      </div>
   );
}


