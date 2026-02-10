import React, { useContext, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    setIsProfileOpen(false);
    navigate("/");
  };

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Close menu when nav link is clicked
  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="menubar navbar navbar-expand-lg sticky-top">
      <div className="container-fluid menubar-container">
        {/* Logo */}
        <NavLink 
          to="/" 
          className="navbar-brand menubar-logo"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.logo} alt="Logo" className="menu-logo" />
        </NavLink>

        {/* Mobile Toggler */}
        <button
          className={`navbar-toggler menubar-toggler ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
        </button>

        {/* Navigation Content */}
        <div
          className={`collapse navbar-collapse menubar-collapse ${
            isMenuOpen ? "show" : ""
          }`}
          id="navbarContent"
        >
          {/* Nav Links */}
          <ul className="navbar-nav menubar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link menubar-link ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi "></i>
                <span>Home</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/explore-product"
                className={({ isActive }) =>
                  `nav-link menubar-link ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi"></i>
                <span>Explore</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link menubar-link ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi"></i>
                <span>Contact</span>
              </NavLink>
            </li>
          </ul>

          {/* Right Section */}
          <div className="menubar-right">
            {/* Cart Icon */}
            <NavLink
              to="/cart"
              className="cart-link"
              onClick={handleNavLinkClick}
            >
              <div className="cart-icon-wrapper">
                <i className="bi bi-bag-fill"></i>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="cart-text">Cart</span>
            </NavLink>

            {/* Auth Section */}
            {!token ? (
              <div className="auth-buttons">
                <button
                  className="btn-login"
                  onClick={() => {
                    handleNavigation("/login");
                  }}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Login</span>
                </button>

                <button
                  className="btn-register"
                  onClick={() => {
                    handleNavigation("/register");
                  }}
                >
                  <i className="bi bi-person-plus-fill"></i>
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="profile-section">
                <button
                  className={`profile-btn ${isProfileOpen ? "active" : ""}`}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User profile menu"
                >
                  <img
                    src={assets.profile}
                    alt="Profile"
                    className="profile-img"
                  />
                  <i className="bi bi-chevron-down"></i>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-title">My Account</p>
                    </div>

                    <ul className="dropdown-menu-custom">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleNavigation("/myorders");
                            setIsProfileOpen(false);
                          }}
                        >
                          <i className="bi bi-bag-check"></i>
                          <span>My Orders</span>
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleNavigation("/profile");
                            setIsProfileOpen(false);
                          }}
                        >
                          <i className="bi bi-person-circle"></i>
                          <span>My Profile</span>
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleNavigation("/settings");
                            setIsProfileOpen(false);
                          }}
                        >
                        
                        </button>
                      </li>

                      <li className="dropdown-divider"></li>

                      <li>
                        <button
                          className="dropdown-item logout-btn"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
