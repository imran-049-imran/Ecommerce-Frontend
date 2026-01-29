import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductCard.css";

const ProductCard = ({ product, loading }) => {
  const navigate = useNavigate();
  const { addItem } = useContext(StoreContext);

  if (loading) {
    return (
      <div className="product-card skeleton">
        <div className="skeleton-img"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  const imgSrc =
    product?.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : "/no-image.png";

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="img-wrapper">
        <img
          src={imgSrc}
          alt={product?.name || "Product"}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/no-image.png")}
        />
        {product.discount && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
      </div>

      <div className="product-info">
        <p className="product-name">{product.name}</p>

        <div className="price-rating">
          <span className="product-price">₹{product.price}</span>
          {product.rating && (
            <span className="rating-badge">
              ⭐ {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>

        {/* ✅ Add to Cart button */}
        <button
          className="add-btn"
          onClick={(e) => {
            e.stopPropagation();
            addItem(product.id); // ✅ context call
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
