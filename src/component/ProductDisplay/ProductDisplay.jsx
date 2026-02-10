import React, { useContext, useMemo, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";
import "./ProductDisplay.css";

const ProductDisplay = ({ category = "all", searchText = "" }) => {
  const { productList, loadingProducts } = useContext(StoreContext);
  const [sortBy, setSortBy] = useState("featured");

  const safeCategory = category?.toLowerCase().trim() || "all";
  const safeSearch = searchText?.toLowerCase().trim() || "";

  const filteredProducts = useMemo(() => {
    let filtered = productList.filter((product) => {
      const productCat = (product.category || "").toLowerCase();
      const name = (product.name || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();

      const matchCategory =
        safeCategory === "all" || productCat === safeCategory;
      const matchSearch =
        !safeSearch ||
        name.includes(safeSearch) ||
        desc.includes(safeSearch);

      return matchCategory && matchSearch;
    });

    // Sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort(
        (a, b) => (b.id || 0) - (a.id || 0)
      );
    }

    return filtered;
  }, [productList, safeCategory, safeSearch, sortBy]);

  return (
    <div className="product-display">
      {/* Filter & Sort Bar */}
      {!loadingProducts && (
        <div className="filter-sort-bar">
          <div className="container">
            <div className="filter-sort-content">
              <div className="results-info">
                <span className="results-count">
                  {filteredProducts.length}
                </span>
                <span className="results-text">
                  {filteredProducts.length === 1 ? "Product" : "Products"} found
                </span>
              </div>

              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">
                  <i className="bi bi-arrow-down-up"></i>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container">
        <div className="products-grid">
          {/* Loading Skeleton */}
          {loadingProducts &&
            [...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-desc"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-button"></div>
              </div>
            ))}

          {/* Products */}
          {!loadingProducts &&
            filteredProducts.length > 0 &&
            filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}

          {/* Empty State */}
          {!loadingProducts && filteredProducts.length === 0 && (
            <div className="empty-state-wrapper">
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-inbox"></i>
                </div>
                <h3 className="empty-title">No Products Found</h3>
                <p className="empty-text">
                  We couldn't find any products matching your search.
                </p>
                <p className="empty-suggestion">
                  Try adjusting your filters or search keyword
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
