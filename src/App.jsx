import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import  Menubar  from "./component/Menubar/Menubar";

import Home from "./Home/Home";
import ExploreProduct from "./ExploreProduct/ExploreProduct";
import Contact from "./pages/Contact/Contact";
import ProductDetails from "./ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./PlaceOrders/PlaceOrder";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";

import PaymentSuccess from "./PaymentSuccess/PaymentSucess";
import PaymentFailed from "./PaymentFailed/PaymentFailed";

import { ToastContainer } from "react-toastify";
import MyOrders from "./MyOrders/MyOrders";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const { token } = useContext(StoreContext);

  return (
    <div>
      <Menubar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore-product" element={<ExploreProduct />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;
