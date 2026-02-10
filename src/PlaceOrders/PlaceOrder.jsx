import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { calculateSubtotal } from "../util/cartUtil";
import { STRIPE_KEY } from "../util/contants";
import "./PlaceOrder.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const stripePromise = loadStripe(STRIPE_KEY);

/* ================= ERROR BOUNDARY ================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <i className="bi bi-exclamation-triangle"></i>
          <h3>Something went wrong</h3>
          <p>Please refresh the page and try again</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ================= PAYMENT FORM ================= */
const CheckoutForm = ({ clientSecret, billing, order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { token, setQuantities } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Payment system not ready");
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${billing.firstName} ${billing.lastName}`,
              email: billing.email,
              phone: billing.phoneNumber,
              address: {
                line1: billing.address,
                city: billing.city,
                state: billing.state,
                postal_code: billing.zipCode,
              },
            },
          },
        }
      );

      if (error) {
        setCardError(error.message);
        toast.error(error.message || "Payment failed");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        try {
          await axios.post(
            "http://localhost:8080/api/orders/verify",
            { stripeOrderId: order.stripeOrderId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          await axios.delete("http://localhost:8080/api/cart/clear", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setQuantities({});
          toast.success("Payment successful 🎉");
          navigate("/payment-success");
        } catch (verifyError) {
          console.error("Verification error:", verifyError);
          toast.warning("Payment received. Your order is being processed.");
          navigate("/payment-success");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setCardError("Payment processing failed. Please try again.");
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h3 className="payment-title">
            <i className="bi bi-credit-card"></i>
            Card Payment
          </h3>
          <p className="payment-subtitle">Enter your card details to complete payment</p>
        </div>

        <div className="payment-form">
          {/* Card Input */}
          <div className="card-input-wrapper">
            <label className="card-label">Card Details</label>
            <div className="card-element-wrapper">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#212121",
                      fontFamily: "'Roboto', sans-serif",
                      "::placeholder": {
                        color: "#878787",
                      },
                    },
                    invalid: {
                      color: "#ff5252",
                    },
                  },
                  hidePostalCode: false,
                }}
                onChange={(e) => {
                  if (e.error) {
                    setCardError(e.error.message);
                  } else {
                    setCardError("");
                  }
                }}
              />
            </div>
            {cardError && (
              <div className="card-error">
                <i className="bi bi-exclamation-circle"></i>
                {cardError}
              </div>
            )}
          </div>

          {/* Order Summary in Payment */}
          <div className="payment-summary">
            <h4 className="summary-title">Order Summary</h4>
            <div className="summary-item">
              <span>Amount to Pay</span>
              <span className="total-amount">₹{order.amount}</span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={loading || !stripe || !elements}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill"></i>
                Pay ₹{order.amount}
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="security-notice">
            <i className="bi bi-shield-check"></i>
            <p>Your payment is secure and encrypted with SSL</p>
          </div>

          {/* Test Card Info */}
          <div className="test-card-info">
            <p>
              <strong>Test Card:</strong> 4242 4242 4242 4242
              <br />
              <strong>Expiry:</strong> Any future date
              <br />
              <strong>CVC:</strong> Any 3 digits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= PLACE ORDER ================= */
const PlaceOrder = () => {
  const { productList = [], quantities, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [clientSecret, setClientSecret] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const cartItems = useMemo(
    () => productList.filter((p) => quantities[p.id] > 0),
    [productList, quantities]
  );

  const { subtotal, shipping, tax, total } = calculateSubtotal(cartItems, quantities);
  const grandTotal = subtotal + shipping + tax;

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const zipRegex = /^[0-9]{5,6}$/;

    if (!billing.firstName.trim()) errors.firstName = "First name required";
    if (!billing.lastName.trim()) errors.lastName = "Last name required";
    if (!emailRegex.test(billing.email)) errors.email = "Valid email required";
    if (!phoneRegex.test(billing.phoneNumber.replace(/\D/g, ""))) 
      errors.phoneNumber = "Valid 10-digit phone required";
    if (!billing.address.trim()) errors.address = "Address required";
    if (!billing.city.trim()) errors.city = "City required";
    if (!billing.state.trim()) errors.state = "State required";
    if (!zipRegex.test(billing.zipCode)) errors.zipCode = "Valid ZIP code required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    if (!token) return navigate("/login");
    if (cartItems.length === 0) return toast.error("Cart is empty");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/orders",
        {
          userName: `${billing.firstName} ${billing.lastName}`,
          userAddress: billing.address,
          email: billing.email,
          phoneNumber: billing.phoneNumber,
          amount: Number(grandTotal.toFixed(2)),
          orderStatus: "CREATED",
          orderedItems: cartItems.map((item) => ({
            productId: item.id,
            quantity: quantities[item.id],
            price: item.price,
            name: item.name,
            category: item.category,
            imageUrl: item.imageUrl,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClientSecret(res.data.stripeClientSecret);
      setOrderDetails(res.data);
      toast.success("Order created. Complete payment.");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Order creation failed";
      toast.error(errorMsg);
      console.error("Order creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { key: "firstName", label: "First Name", type: "text", icon: "bi-person" },
    { key: "lastName", label: "Last Name", type: "text", icon: "bi-person" },
    { key: "email", label: "Email Address", type: "email", icon: "bi-envelope" },
    { key: "phoneNumber", label: "Phone Number", type: "tel", icon: "bi-telephone" },
    { key: "address", label: "Street Address", type: "text", icon: "bi-geo-alt" },
    { key: "city", label: "City", type: "text", icon: "bi-building" },
    { key: "state", label: "State", type: "text", icon: "bi-map" },
    { key: "zipCode", label: "ZIP Code", type: "text", icon: "bi-postcard" },
  ];

  return (
    <ErrorBoundary>
      <div className="place-order-page">
        <div className="container">
          {/* Header */}
          <div className="checkout-header">
            <h1 className="checkout-title">
              <i className="bi bi-bag-check"></i>
              Complete Your Order
            </h1>
            <p className="checkout-subtitle">Step {clientSecret ? "2" : "1"} of 2</p>
          </div>

          <div className="checkout-container">
            {!clientSecret ? (
              /* ========== BILLING FORM ========== */
              <div className="checkout-form-section">
                <form onSubmit={submitOrder} className="checkout-form">
                  <div className="form-header">
                    <h3 className="form-title">
                      <i className="bi bi-geo-alt-fill"></i>
                      Billing Address
                    </h3>
                  </div>

                  <div className="form-grid">
                    {formFields.map(({ key, label, type, icon }) => (
                      <div
                        key={key}
                        className={`form-group ${
                          key === "address" ? "col-span-2" : ""
                        }`}
                      >
                        <label className="form-label">{label}</label>
                        <div className="input-wrapper">
                          <i className={`bi ${icon}`}></i>
                          <input
                            type={type}
                            name={key}
                            value={billing[key]}
                            onChange={(e) => {
                              setBilling({ ...billing, [key]: e.target.value });
                              if (formErrors[key]) {
                                setFormErrors({ ...formErrors, [key]: "" });
                              }
                            }}
                            placeholder={label}
                            className={formErrors[key] ? "error" : ""}
                          />
                        </div>
                        {formErrors[key] && (
                          <span className="error-message">
                            <i className="bi bi-exclamation-circle"></i>
                            {formErrors[key]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn-continue"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-right"></i>
                        Continue to Payment
                      </>
                    )}
                  </button>
                </form>

                {/* Order Summary Sidebar */}
                <div className="order-summary-sidebar">
                  <div className="summary-card">
                    <h3 className="summary-title">Order Summary</h3>

                    <div className="summary-items">
                      {cartItems.map((item) => (
                        <div key={item.id} className="summary-item-row">
                          <div className="item-info">
                            <img src={item.imageUrl} alt={item.name} />
                            <div>
                              <p className="item-name">{item.name}</p>
                              <p className="item-qty">Qty: {quantities[item.id]}</p>
                            </div>
                          </div>
                          <span className="item-price">
                            ₹{(item.price * quantities[item.id]).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-breakdown">
                      <div className="breakdown-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Tax</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="total-row">
                      <span>Total</span>
                      <span className="total-amount">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="trust-badges">
                    <div className="badge">
                      <i className="bi bi-shield-check"></i>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="badge">
                      <i className="bi bi-check-circle"></i>
                      <span>Easy Returns</span>
                    </div>
                    <div className="badge">
                      <i className="bi bi-truck"></i>
                      <span>Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ========== PAYMENT FORM ========== */
              clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <div className="payment-form-section">
                    <CheckoutForm
                      clientSecret={clientSecret}
                      billing={billing}
                      order={orderDetails}
                    />
                  </div>
                </Elements>
              )
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PlaceOrder;
