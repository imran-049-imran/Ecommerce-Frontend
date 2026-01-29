import React, { useContext, useMemo } from "react";
import { StoreContext } from "../../context/StoreContext";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductDisplay.css";

const ProductDisplay = ({ category = "all", searchText = "" }) => {
  const { productList, loadingProducts } = useContext(StoreContext);

  const safeCategory = category?.toLowerCase().trim() || "all";
  const safeSearch = searchText?.toLowerCase().trim() || "";

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const productCat = (product.category || "").toLowerCase();
      const name = (product.name || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();

      const matchCategory =
        safeCategory === "all" || productCat === safeCategory;
      const matchSearch =
        !safeSearch || name.includes(safeSearch) || desc.includes(safeSearch);

      return matchCategory && matchSearch;
    });
  }, [productList, safeCategory, safeSearch]);

  return (
    <div className="product-display">
      {/* Grid */}
      <div className="container">
        <div className="row g-4">
          {loadingProducts &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard loading />
              </div>
            ))}

          {!loadingProducts &&
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <ProductCard product={product} />
              </div>
            ))}

          {!loadingProducts && filteredProducts.length === 0 && (
            <div className="empty-state">
              <img
                src="/assets/empty.png"
                alt="No products"
                className="empty-img"
              />
              <h5>No products found</h5>
              <p>Try changing category or search keyword</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
