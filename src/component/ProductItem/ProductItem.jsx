import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
  const { increaseQty, decreaseQty, quantities } =
    useContext(StoreContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} />
      </Link>

      <div className="product-body">
        <h5 className="product-title">{product.name}</h5>

        {/* ✅ DESCRIPTION (3 lines only) */}
        <p className="product-desc">
          {product.description}
        </p>

        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <span className="rating">⭐ 4.5</span>
        </div>
      </div>

      <div className="product-footer">
        {quantities[product.id] > 0 ? (
          <div className="qty-box">
            <button onClick={() => decreaseQty(product.id)}>-</button>
            <span>{quantities[product.id]}</span>
            <button onClick={() => increaseQty(product.id)}>+</button>
          </div>
        ) : (
          <button
            className="add-btn"
            onClick={() => increaseQty(product.id)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
