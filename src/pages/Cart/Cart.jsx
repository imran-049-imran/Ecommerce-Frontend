import React, { useContext } from "react";
import "./Cart.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { calculateSubtotal } from "../../util/cartUtil";

const Cart = () => {
  const navigate = useNavigate();

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

  return (
    <div className="cart-container container py-4">
      <Link to="/explore-product" className="continue-btn">
        ← Continue Shopping
      </Link>

      <h2 className="cart-title">Shopping Cart</h2>

      <div className="row">
        <div className="col-lg-8">
          {loadingProducts ? (
            <div className="loading-skeleton">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart text-center">
              <img src={assets.cart} alt="Empty Cart" className="empty-img" />
              <h5>Your cart is empty</h5>
              <Link to="/explore-product" className="btn btn-primary mt-3">
                Shop Now
              </Link>
            </div>
          ) : (
            cartItems.map((product) => (
              <div className="cart-card" key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="cart-img"
                  loading="lazy"
                />

                <div className="cart-info">
                  <h6>{product.name}</h6>
                  <p className="category text-muted">{product.category}</p>
                </div>

                <div className="qty-box">
                  <button onClick={() => decreaseQty(product.id)}>-</button>
                  <span>{quantities[product.id]}</span>
                  <button onClick={() => increaseQty(product.id)}>+</button>
                </div>

                <div className="price">
                  ₹{(product.price * quantities[product.id]).toFixed(2)}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeItem(product.id)}
                  title="Remove item"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="col-lg-4">
          <div className="order-summary">
            <h5>Order Summary</h5>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/order")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
