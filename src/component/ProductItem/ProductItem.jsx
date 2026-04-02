import React, { useContext, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductItem.css";

// ─── Inline SVG Icons (removes Bootstrap Icons dependency) ───────────────────
const HeartIcon     = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon      = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const PlusIcon      = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MinusIcon     = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const BagIcon       = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const CheckIcon     = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon         = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Fallback image — inline SVG data URI, zero network request ───────────────
const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f1f5f9'/%3E%3Crect x='110' y='90' width='80' height='70' rx='6' fill='%23cbd5e1'/%3E%3Ccircle cx='130' cy='110' r='10' fill='%23e2e8f0'/%3E%3Cpolygon points='110,160 150,115 180,145 200,125 220,160' fill='%23e2e8f0'/%3E%3Ctext x='150' y='200' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E`;

// ─── Component ────────────────────────────────────────────────────────────────
const ProductItem = ({ product }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imgError, setImgError]           = useState(false);
  const [isFavorite, setIsFavorite]       = useState(false);

  // Support both _id (MongoDB) and id
  const productId   = product._id ?? product.id;
  // Support both imageUrl and image field names
  const imageSrc    = imgError ? FALLBACK_IMAGE : (product.imageUrl || product.image || FALLBACK_IMAGE);

  const currentQty    = quantities[productId] || 0;
  const discount      = product.discount || 0;
  const originalPrice = discount > 0
    ? Math.round(product.price / (1 - discount / 100))
    : null;

  // ── FIX: onError with guard prevents infinite 404 loop ──────────────────────
  const handleImgError = useCallback(() => {
    setImgError(true);
    setIsImageLoaded(true); // stop showing skeleton
  }, []);

  const handleImgLoad  = useCallback(() => setIsImageLoaded(true), []);
  const handleFavorite = useCallback((e) => {
    e.preventDefault();
    setIsFavorite((prev) => !prev);
  }, []);

  return (
    <div className="pi-card">

      {/* ── Image ── */}
      <Link to={`/product/${productId}`} className="pi-img-link">
        <div className="pi-img-wrap">

          {/* Skeleton shown until image loads */}
          {!isImageLoaded && <div className="pi-skeleton" aria-hidden="true" />}

          <img
            src={imageSrc}
            alt={product.name}
            className={`pi-img ${isImageLoaded ? "pi-img--loaded" : ""}`}
            onLoad={handleImgLoad}
            onError={handleImgError}   /* ← FIX: was missing, caused 404 spam */
          />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="pi-discount" aria-label={`${discount}% off`}>
              -{discount}%
            </div>
          )}

          {/* Favourite */}
          <button
            className={`pi-fav ${isFavorite ? "pi-fav--active" : ""}`}
            onClick={handleFavorite}
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
            type="button"
          >
            <HeartIcon filled={isFavorite} />
          </button>

          {/* Hover overlay */}
          <div className="pi-overlay" aria-hidden="true">
            <span className="pi-quick-view">Quick View</span>
          </div>
        </div>
      </Link>

      {/* ── Body ── */}
      <div className="pi-body">
        <h5 className="pi-name" title={product.name}>{product.name}</h5>

        {product.description && (
          <p className="pi-desc" title={product.description}>
            {product.description}
          </p>
        )}

        {/* Price + Rating */}
        <div className="pi-meta">
          <div className="pi-prices">
            <span className="pi-price">₹{product.price.toLocaleString("en-IN")}</span>
            {originalPrice && (
              <span className="pi-original">₹{originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
          <div className="pi-rating" aria-label={`Rating: ${product.rating || 4.5}`}>
            <StarIcon />
            <span>{product.rating || 4.5}</span>
          </div>
        </div>

        {/* Stock */}
        {product.stock !== undefined && (
          <div className={`pi-stock ${product.stock > 0 ? "pi-stock--in" : "pi-stock--out"}`}>
            {product.stock > 0 ? (
              <><CheckIcon /><span>{product.stock} in stock</span></>
            ) : (
              <><XIcon /><span>Out of stock</span></>
            )}
          </div>
        )}
      </div>

      {/* ── Footer: Cart controls ── */}
      <div className="pi-footer">
        {currentQty > 0 ? (
          <div className="pi-qty" role="group" aria-label="Quantity">
            <button className="pi-qty-btn" onClick={() => decreaseQty(productId)} aria-label="Decrease">
              <MinusIcon />
            </button>
            <span className="pi-qty-val" aria-live="polite">{currentQty}</span>
            <button className="pi-qty-btn" onClick={() => increaseQty(productId)} aria-label="Increase">
              <PlusIcon />
            </button>
          </div>
        ) : (
          <button
            className="pi-add-btn"
            onClick={() => increaseQty(productId)}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            <BagIcon />
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default ProductItem;
