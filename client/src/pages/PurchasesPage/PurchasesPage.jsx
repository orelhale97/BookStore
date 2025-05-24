import { useEffect, useState } from "react";
import { fetchUserPurchases } from "../../services/user.service";
import "./PurchasesPage.scss";
import { useAuth } from "../../context/AuthContext";

export default function PurchasesPage() {
  const { user } = useAuth();

  const [purchases, setPurchases] = useState();

  useEffect(() => {
    const { id } = user || {};

    if (id) {
      fetchUserPurchases(id)
        .then((list) => {
          setPurchases(list?.filter((purchase) => purchase.book));
        })
        .catch((err) => console.error("Error loading Purchases:", err));
    }
  }, [user]);

  useEffect(() => {
    if (purchases) {
      console.log("purchases", purchases);
    }
  }, [purchases]);

  return (
    <div className="PurchasesPage">
      <h2>My Book Purchases</h2>
      {!purchases?.length ? (
        <p>No purchases found.</p>
      ) : (
        <ul className="purchases-list">
          {purchases.map((purchase) => (
            <li key={purchase.id} className="purchase-card">
              <img src={purchase.book?.src} className="book-image" />
              <div className="purchase-details">
                <h3>{purchase.book?.name}</h3>
                <p>
                  Purchased on: {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
