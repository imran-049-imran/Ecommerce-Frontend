import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Orders response:", res.data);

      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="orders-container">
      <div className="orders-card">
        <h3 className="mb-3 fw-bold">My Orders</h3>

        {loading ? (
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-row"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <img src={assets.cart} alt="No orders" className="empty-img" />
            <h5 className="no-orders">No products ordered yet</h5>
            <p className="text-secondary">Start shopping to see your orders here</p>
          </div>
        ) : (
          <table className="orders-table">
            <tbody>
              {orders.map((order) => (
                <tr className="order-row" key={order.id}>
                  {/* ICON */}
                  <td>
                    <img
                      src={assets.delivery}
                      alt="Delivery"
                      className="order-image"
                    />
                  </td>

                  {/* PRODUCTS */}
                  <td className="order-items">
                    {order.orderedItems?.map((product, i) => (
                      <span key={i}>
                        {product.name} × {product.quantity}
                        {i !== order.orderedItems.length - 1 && ", "}
                      </span>
                    ))}
                  </td>

                  {/* AMOUNT */}
                  <td className="order-amount">₹{order.amount}</td>

                  {/* COUNT */}
                  <td className="order-count">
                    {order.orderedItems?.length} items
                  </td>

                  {/* STATUS */}
                  <td
                    className={`order-status ${order.orderStatus?.toLowerCase()}`}
                  >
                    ● {order.orderStatus}
                  </td>

                  {/* REFRESH */}
                  <td>
                    <button
                      className="refresh-btn"
                      onClick={fetchOrders}
                      title="Refresh order status"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
