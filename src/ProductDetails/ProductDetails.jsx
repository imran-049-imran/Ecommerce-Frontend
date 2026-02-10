import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    productList,
    increaseQty,
    decreaseQty,
    quantities,
  } = useContext(StoreContext);

  const product = productList.find((p) => String(p.id) === String(id));

  const qty = quantities[id] || 0;
  const [mainImg, setMainImg] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (product?.imageUrl) {
      setMainImg(product.imageUrl);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  const originalPrice = product.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : product.price;

  const discount = product.discount || 0;
  const handleFavorite = () => setIsFavorite(!isFavorite);
  const handleAddToCart = () => increaseQty(product.id);
  const handleBuyNow = () => {
    if (qty === 0) increaseQty(product.id);
    navigate("/cart");
  };

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-item">Home</span>
          <i className="bi bi-chevron-right"></i>
          <span className="breadcrumb-item">{product.category}</span>
          <i className="bi bi-chevron-right"></i>
          <span className="breadcrumb-item active">{product.name}</span>
        </div>

        <div className="product-details-container">
          {/* LEFT SECTION - Images */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img
                src={mainImg}
                alt={product.name}
                className="main-image"
                onError={(e) => (e.currentTarget.src = "/no-image.png")}
              />

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="discount-badge">
                  <span className="discount-text">-{discount}%</span>
                </div>
              )}

              {/* Favorite Button */}
              <button
                className={`favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={handleFavorite}
                aria-label="Add to favorites"
              >
                <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
              </button>

              {/* Image Badge */}
              <div className="image-badge">
                <i className="bi bi-camera"></i>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <i className="bi bi-truck"></i>
                <div>
                  <h4>Free Delivery</h4>
                  <p>On orders above ₹499</p>
                </div>
              </div>
              <div className="feature">
                <i className="bi bi-cash-coin"></i>
                <div>
                  <h4>Cash on Delivery</h4>
                  <p>Pay at your convenience</p>
                </div>
              </div>
              <div className="feature">
                <i className="bi bi-arrow-repeat"></i>
                <div>
                  <h4>7 Days Return</h4>
                  <p>Easy returns & exchange</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Details */}
          <div className="product-info-section">
            {/* Title & Rating */}
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>

              <div className="rating-section">
                <div className="rating-stars">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-half"></i>
                </div>
                <span className="rating-value">4.4 out of 5</span>
                <span className="rating-count">(2,493 ratings)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-container">
                <span className="current-price">₹{product.price}</span>
                {discount > 0 && (
                  <>
                    <span className="original-price">₹{originalPrice}</span>
                    <span className="discount-percent">{discount}% Off</span>
                  </>
                )}
              </div>

              <p className="price-info">Inclusive of all taxes</p>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Description */}
            <div className="description-section">
              <h3>About this product</h3>
              <p className="description-text">{product.description}</p>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div
                className={`stock-section ${
                  product.stock > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                <i className={`bi ${product.stock > 0 ? "bi-check-circle" : "bi-x-circle"}`}></i>
                <div>
                  <h4>
                    {product.stock > 0
                      ? product.stock > 10
                        ? "In Stock"
                        : `Only ${product.stock} left`
                      : "Out of Stock"}
                  </h4>
                  <p>
                    {product.stock > 0
                      ? "Get it delivered soon"
                      : "Currently unavailable"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {qty > 0 ? (
                <div className="quantity-selector">
                  <button
                    className="qty-btn qty-decrease"
                    onClick={() => decreaseQty(product.id)}
                    title="Decrease quantity"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button
                    className="qty-btn qty-increase"
                    onClick={() => increaseQty(product.id)}
                    title="Increase quantity"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <button
                    className="btn-add-cart active"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-bag-plus"></i>
                    Add to Cart
                  </button>
                </div>
              ) : (
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  <i className="bi bi-bag-plus"></i>
                  Add to Cart
                </button>
              )}

              <button className="btn-buy-now" onClick={handleBuyNow}>
                <i className="bi bi-lightning-fill"></i>
                Buy Now
              </button>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Offers Section */}
            <div className="offers-section">
              <h3>Offers & Deals</h3>
              <div className="offers-list">
                <div className="offer">
                  <span className="offer-badge">5% OFF</span>
                  <span>on HDFC Credit Card EMI</span>
                </div>
                <div className="offer">
                  <span className="offer-badge">10% OFF</span>
                  <span>on select debit cards</span>
                </div>
                <div className="offer">
                  <span className="offer-badge">FREE</span>
                  <span>Extended warranty available</span>
                </div>
              </div>
            </div>

            {/* Details Tabs */}
            <div className="tabs-section">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  <i className="bi bi-info-circle"></i>
                  Details
                </button>
                <button
                  className={`tab ${activeTab === "shipping" ? "active" : ""}`}
                  onClick={() => setActiveTab("shipping")}
                >
                  <i className="bi bi-box-seam"></i>
                  Shipping
                </button>
                <button
                  className={`tab ${activeTab === "returns" ? "active" : ""}`}
                  onClick={() => setActiveTab("returns")}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                  Returns
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "details" && (
                  <div className="tab-pane">
                    <h4>Product Details</h4>
                    <ul>
                      <li>
                        <span>Category:</span> {product.category}
                      </li>
                      <li>
                        <span>Brand:</span> Premium Brand
                      </li>
                      <li>
                        <span>Warranty:</span> 1 Year
                      </li>
                      <li>
                        <span>Availability:</span>{" "}
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="tab-pane">
                    <h4>Shipping Information</h4>
                    <ul>
                      <li>
                        <span>Delivery Time:</span> 2-3 business days
                      </li>
                      <li>
                        <span>Shipping Cost:</span> FREE (on orders above ₹499)
                      </li>
                      <li>
                        <span>Shipped By:</span> Our Warehouse
                      </li>
                      <li>
                        <span>Packaging:</span> Secure & Eco-friendly
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "returns" && (
                  <div className="tab-pane">
                    <h4>Return & Exchange Policy</h4>
                    <ul>
                      <li>
                        <span>Return Period:</span> 7 days from delivery
                      </li>
                      <li>
                        <span>Condition:</span> Product must be unused
                      </li>
                      <li>
                        <span>Refund:</span> Full refund to original payment method
                      </li>
                      <li>
                        <span>Pickup:</span> Free pickup from your address
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
