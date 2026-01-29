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

  const product = productList.find(
    (p) => String(p.id) === String(id)
  );

  const qty = quantities[id] || 0;
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (product?.imageUrl) {
      setMainImg(product.imageUrl);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center mt-5">Loading product...</div>;
  }

  return (
    <div className="product-details container mt-4">

      <div className="row">

        {/* ================= LEFT IMAGE ================= */}
        <div className="col-md-5">
          <div className="image-box">
            <img src={mainImg} alt={product.name} />
          </div>
        </div>

        {/* ================= RIGHT DETAILS ================= */}
        <div className="col-md-7">

          <h2 className="title">{product.name}</h2>

          <p className="rating">
            ⭐ 4.4 | <span className="text-primary">ratings (2,493)</span>
          </p>

          <hr />

          <div className="price-box">
            <span className="price">₹{product.price}</span>
            {product.discount && (
              <span className="discount">{product.discount}% OFF</span>
            )}
          </div>

          <p className="desc">{product.description}</p>

          {/* <ul className="offers">
            <li>✔ Free Delivery</li>
            <li>✔ Cash on Delivery</li>
            <li>✔ 7 Days Replacement</li>
          </ul> */}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="action-row">

            {qty > 0 ? (
              <div className="qty-box">
                <button onClick={() => decreaseQty(product.id)}>-</button>
                <span>{qty}</span>
                <button onClick={() => increaseQty(product.id)}>+</button>
              </div>
            ) : (
              <button
                className="add-cart-btn"
                onClick={() => increaseQty(product.id)}
              >
                Add to Cart
              </button>
            )}

            <button
              className="buy-now-btn"
              onClick={() => {
                if (qty === 0) increaseQty(product.id);
                navigate("/cart");
              }}
            >
              Buy Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
