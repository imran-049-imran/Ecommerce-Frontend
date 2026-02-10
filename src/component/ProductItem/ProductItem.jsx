import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const currentQty = quantities[product.id] || 0;
  const discount = product.discount || 0;
  const originalPrice = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : product.price;

  const handleAddToCart = () => {
    increaseQty(product.id);
  };

  const handleIncrease = () => {
    increaseQty(product.id);
  };

  const handleDecrease = () => {
    decreaseQty(product.id);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="product-image-link">
        <div className="product-image-container">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`product-image ${isImageLoaded ? "loaded" : ""}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && <div className="image-skeleton"></div>}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="discount-badge">
              <span className="discount-percent">-{discount}%</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
          </button>

          {/* Hover Overlay */}
          <div className="image-overlay">
            <Link to={`/product/${product.id}`} className="view-details-btn">
              Quick View
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="product-body">
        <h5 className="product-title" title={product.name}>
          {product.name}
        </h5>

        {/* Description */}
        <p className="product-desc" title={product.description}>
          {product.description}
        </p>

        {/* Price & Rating Section */}
        <div className="price-rating-row">
          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            {discount > 0 && (
              <span className="original-price">₹{originalPrice}</span>
            )}
          </div>
          <div className="rating-section">
            <span className="rating-stars">
              <i className="bi bi-star-fill"></i>
            </span>
            <span className="rating-value">{product.rating || 4.5}</span>
          </div>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className={`stock-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0 ? (
              <>
                <i className="bi bi-check-circle"></i>
                <span>{product.stock} in stock</span>
              </>
            ) : (
              <>
                <i className="bi bi-x-circle"></i>
                <span>Out of stock</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Product Footer - Quantity Controls */}
      <div className="product-footer">
        {currentQty > 0 ? (
          <div className="qty-controller">
            <button
              className="qty-btn qty-decrease"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
            >
              <i className="bi bi-dash"></i>
            </button>
            <span className="qty-display">{currentQty}</span>
            <button
              className="qty-btn qty-increase"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        ) : (
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <i className="bi bi-bag-plus"></i>
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
