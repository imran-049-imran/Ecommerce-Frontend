import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(null);

  const fetchOrders = async (isRefresh = false) => {
    if (!token) return;

    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:8080/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      setOrders(res.data || []);
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? "Session expired. Please login again."
          : error.response?.status === 404
          ? "No orders found."
          : "Failed to fetch orders. Please try again.";

      setError(errorMessage);
      console.error("Failed to fetch orders:", error);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleRefresh = (e) => {
    e.stopPropagation();
    fetchOrders(true);
  };

  const getStatusBadgeClass = (status) => {
    return `order-status ${status?.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="orders-wrapper">
      <div className="orders-container">
        <div className="orders-header">
          <h2 className="orders-title">My Orders</h2>
          <p className="orders-subtitle">Track and manage your purchases</p>
        </div>

        {error && (
          <div className="error-alert">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-content">
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text long"></div>
                  <div className="skeleton-text medium"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <img src={assets.cart} alt="No orders" className="empty-icon" />
            </div>
            <h3 className="empty-title">No Orders Yet</h3>
            <p className="empty-description">
              You haven't placed any orders yet. Start exploring and add items to
              your cart!
            </p>
            <a href="/" className="empty-cta">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div className="order-info">
                    <h4 className="order-id">Order #{order.id}</h4>
                    <span className="order-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <button
                    className={`refresh-btn ${refreshing === order.id ? "loading" : ""}`}
                    onClick={handleRefresh}
                    disabled={refreshing === order.id}
                    title="Refresh order status"
                    aria-label={`Refresh status for order ${order.id}`}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>

                <div className="order-card-body">
                  <div className="order-items-section">
                    <h5 className="section-label">Items</h5>
                    <div className="items-list">
                      {order.orderedItems?.length > 0 ? (
                        order.orderedItems.map((product, i) => (
                          <div className="item-badge" key={i}>
                            <span className="item-name">{product.name}</span>
                            <span className="item-qty">×{product.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No items in this order</p>
                      )}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-box">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value amount">
                        {formatAmount(order.amount)}
                      </span>
                    </div>

                    <div className="detail-box">
                      <span className="detail-label">Items Count</span>
                      <span className="detail-value">
                        {order.orderedItems?.length || 0}
                      </span>
                    </div>

                    <div className="detail-box">
                      <span className="detail-label">Status</span>
                      <span className={getStatusBadgeClass(order.orderStatus)}>
                        ● {order.orderStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="order-card-footer">
                    <i className="bi bi-geo-alt"></i>
                    <span className="delivery-address">
                      {order.deliveryAddress}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
