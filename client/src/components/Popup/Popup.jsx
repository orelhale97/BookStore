import './Popup.scss';


export default function Popup({ onClose, children }) {
   return (
      <div className="popup-overlay" onClick={onClose}>
         <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {children}
         </div>
      </div>
   );
};
