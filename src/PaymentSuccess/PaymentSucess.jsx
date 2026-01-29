import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PaymentSucess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-status-wrapper">
      <div className="payment-card success">

        <div className="status-icon success">
          <span>₹</span>
        </div>

        <h2>Payment Successful</h2>
        <p>
          Your order has been placed successfully.
          Thank you for shopping with us!
        </p>

        <div className="action-buttons">
          <button
            className="btn primary-btn"
            onClick={() => navigate("/myorders")}
          >
            View Orders
          </button>

          <Link to="/explore-product" className="btn secondary-btn">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
