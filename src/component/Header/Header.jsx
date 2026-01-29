import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import headerImg from "../../assets/header.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <img src={headerImg} alt="Banner" className="header-img" />

      <div className="header-content">
        


        <button
          className="explore-btn"
          onClick={() => navigate("/explore-product")}
        >
          Explore Shopping
        </button>
      </div>
    </div>
  );
};

export default Header;
