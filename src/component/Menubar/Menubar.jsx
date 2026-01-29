import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./Menubar.css";

const Menubar = () => {
  const {
    cartCount,
    token,
    setToken,
    setQuantities,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // 🔴 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg ecommerce-navbar sticky-top">
      <div className="container">

        {/* LOGO → HOME */}
        <NavLink to="/" className="navbar-brand">
          <img src={assets.logo} alt="logo" className="menu-logo" />
        </NavLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* NAV LINKS */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/explore-product"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Explore 
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">

            {/* CART */}
            <NavLink to="/cart" className="cart-icon position-relative">
              <img src={assets.cart} alt="cart" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </NavLink>

            {/* AUTH */}
            {!token ? (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="dropdown">
                <img
                  src={assets.profile}
                  alt="profile"
                  className="profile-img dropdown-toggle"
                  data-bs-toggle="dropdown"
                />

                <ul className="dropdown-menu dropdown-menu-end">
                  <li
                    className="dropdown-item"
                    onClick={() => navigate("/myorders")}
                  >
                    My Orders
                  </li>
                  <li className="dropdown-item" onClick={logout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
