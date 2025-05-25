import { useEffect, useState } from "react";
import { fetchUserPurchases } from "../../services/user.service";
import "./PurchasesPage.scss";
import { useAppContext } from "../../context/AppContext";

export default function PurchasesPage() {

  const { user } = useAppContext();

  const [purchases, setPurchases] = useState();


  useEffect(() => {
    if (user?.id) {
      fetchUserPurchases(user.id)
        .then((list) => setPurchases(list?.filter((purchase) => purchase.book)))
        .catch((err) => console.error("Error loading Purchases:", err));
    }
  }, [user]);


  return (
    <div className="PurchasesPage">
      <h2>My Book Purchases</h2>
      {!purchases?.length ?
        (<p>No purchases found.</p>) :
        (
          <ul className="purchases-list">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="purchase-card">
                <img src={purchase.book?.src} className="book-image" />
                <div className="purchase-details">
                  <h3>{purchase.book?.name}</h3>
                  <p>Purchased on: {new Date(purchase.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
