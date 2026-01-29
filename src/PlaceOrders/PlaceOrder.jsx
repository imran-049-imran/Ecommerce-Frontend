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

/* ================= PAYMENT FORM ================= */
const CheckoutForm = ({ clientSecret, billing, order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { token, setQuantities } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

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
        toast.error(error.message || "Payment failed");
        return navigate("/payment-failed");
      }

      if (paymentIntent.status === "succeeded") {
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
      }
    } catch (err) {
      toast.error("Payment failed");
      navigate("/payment-failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-ui-card">
      <h5 className="payment-title">Card Payment</h5>
      <div className="payment-card-input">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${order.amount}`}
      </button>
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

  const cartItems = useMemo(
    () => productList.filter((p) => quantities[p.id] > 0),
    [productList, quantities]
  );

  const { total } = calculateSubtotal(cartItems, quantities);
  const shipping = 10;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!token) return navigate("/login");
    if (cartItems.length === 0) return toast.error("Cart is empty");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/orders",
        {
          userName: `${billing.firstName} ${billing.lastName}`, // ✅ send name
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
    } catch {
      toast.error("Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container place-order-container">
      <h3 className="mb-4 fw-bold">Checkout</h3>

      {!clientSecret && (
        <form onSubmit={submitOrder} className="checkout-form">
          {Object.entries(billing).map(([key, value]) => (
            <input
              key={key}
              name={key}
              value={value}
              onChange={(e) =>
                setBilling({ ...billing, [key]: e.target.value })
              }
              placeholder={key.replace(/([A-Z])/g, " $1")}
              required
            />
          ))}

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating Order..." : "Continue to Payment"}
          </button>
        </form>
      )}

      {clientSecret && orderDetails && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            billing={billing}
            order={orderDetails}
          />
        </Elements>
      )}
    </div>
  );
};

export default PlaceOrder;
