import React from "react";
import { Link } from "react-router-dom";
import "./PaymentFailed.css";

const PaymentFailed = () => {
  return (
    <div className="payment-status-wrapper">
      <div className="payment-card failed">

        <div className="status-icon failed">
          <span>₹</span>
        </div>

        <h2>Payment Failed</h2>
        <p>
          Unfortunately, your payment could not be processed.
          Please check your details and try again.
        </p>

        <div className="action-buttons">
          <Link to="/order" className="btn retry-btn">
            Try Again
          </Link>

          <Link to="/cart" className="btn secondary-btn">
            Back to Cart
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;
