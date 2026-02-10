import React, { useContext, useState } from "react";
import "./Cart.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { calculateSubtotal } from "../../util/cartUtil";

const Cart = () => {
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const {
    productList,
    increaseQty,
    decreaseQty,
    quantities,
    removeItem,
    loadingProducts,
  } = useContext(StoreContext);

  const cartItems = productList.filter(
    (product) => quantities[product.id] && quantities[product.id] > 0
  );

  const { subtotal, shipping, tax, total } = calculateSubtotal(
    cartItems,
    quantities
  );

  const handleRemoveItem = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 200);
  };

  const discount = cartItems.length > 0 ? Math.round((total - subtotal) * 0.05) : 0;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <Link to="/explore-product" className="back-link">
            <i className="bi bi-chevron-left"></i>
            <span>Continue Shopping</span>
          </Link>
          <h1 className="cart-title">
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="item-count">({cartItems.length} items)</span>
            )}
          </h1>
        </div>

        <div className="cart-content">
          {/* Main Cart Section */}
          <div className="cart-main">
            {loadingProducts ? (
              <div className="loading-skeleton">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                    </div>
                    <div className="skeleton-price"></div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">
                  <i className="bi bi-bag-x"></i>
                </div>
                <h2>Your cart is empty</h2>
                <p>Add items from our store to get started</p>
                <Link to="/explore-product" className="btn-explore">
                  <i className="bi bi-shop"></i>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((product) => (
                  <div
                    key={product.id}
                    className={`cart-item ${removingId === product.id ? "removing" : ""}`}
                  >
                    {/* Product Image */}
                    <div className="item-image">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/no-image.png")}
                      />
                      {product.discount && (
                        <span className="discount-badge">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="item-details">
                      <h3 className="item-name">{product.name}</h3>
                      <p className="item-category">{product.category}</p>
                      {product.stock !== undefined && (
                        <p
                          className={`stock-info ${
                            product.stock > 0 ? "in-stock" : "out-of-stock"
                          }`}
                        >
                          {product.stock > 0 ? (
                            <>
                              <i className="bi bi-check-circle"></i>
                              {product.stock > 10
                                ? "In Stock"
                                : `Only ${product.stock} left`}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-x-circle"></i>
                              Out of Stock
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="item-quantity">
                      <button
                        className="qty-btn qty-minus"
                        onClick={() => decreaseQty(product.id)}
                        title="Decrease quantity"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="qty-value">{quantities[product.id]}</span>
                      <button
                        className="qty-btn qty-plus"
                        onClick={() => increaseQty(product.id)}
                        title="Increase quantity"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="item-price">
                      <div className="price-info">
                        <span className="unit-price">₹{product.price}</span>
                        <span className="total-price">
                          ₹{(product.price * quantities[product.id]).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveItem(product.id)}
                      title="Remove from cart"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          {cartItems.length > 0 && (
            <div className="cart-sidebar">
              <div className="order-summary">
                <h3 className="summary-title">Order Summary</h3>

                {/* Summary Rows */}
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="label">Subtotal</span>
                    <span className="value">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span className="label">Discount</span>
                      <span className="value">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span className="label">Shipping</span>
                    <span className="value">
                      {shipping === 0 ? (
                        <span className="free">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="label">Tax</span>
                    <span className="value">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total">
                    <span className="label">Total</span>
                    <span className="value">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="promo-section">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="promo-input"
                    disabled
                  />
                  <button className="promo-btn" disabled>
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button
                  className="btn-checkout"
                  disabled={cartItems.length === 0}
                  onClick={() => navigate("/order")}
                >
                  <i className="bi bi-lock-fill"></i>
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link to="/explore-product" className="btn-continue">
                  Continue Shopping
                </Link>
              </div>

              {/* Savings Info */}
              {cartItems.length > 0 && (
                <div className="savings-info">
                  <i className="bi bi-lightbulb"></i>
                  <div>
                    <h4>Great Savings!</h4>
                    <p>You're saving ₹{discount.toFixed(2)} on this order</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
