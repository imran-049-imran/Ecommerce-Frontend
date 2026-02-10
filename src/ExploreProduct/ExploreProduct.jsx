import React, { useState, useEffect } from "react";
import ProductDisplay from "../component/ProductDisplay/ProductDisplay";
import "./ExploreProduct.css";

const ExploreProduct = () => {
  const [category, setCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "accessories", label: "Accessories" },
    { value: "art-supplies", label: "Art Supplies" },
    { value: "baby products", label: "Baby Products" },
    { value: "bags", label: "Bags" },
    { value: "bakery", label: "Bakery" },
    { value: "bath", label: "Bath" },
    { value: "beauty", label: "Beauty" },
    { value: "books", label: "Books" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "toys & games", label: "Toys & Games" },
    { value: "home & furniture", label: "Home & Furniture" },
    { value: "mobiles", label: "Mobiles" },
    { value: "grocery", label: "Grocery" },
  ];

  const handleClearSearch = () => {
    setSearchText("");
    setDebouncedSearch("");
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Trigger search if needed
    setDebouncedSearch(searchText);
  };

  return (
    <div className="explore-wrapper">
      {/* Search Bar Section */}
      <div className="explore-search-section">
        <div className="explore-search container">
          <div className="search-header">
            <h1 className="search-title">Find Your Perfect Product</h1>
            <p className="search-subtitle">
              Browse through thousands of products across all categories
            </p>
          </div>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            {/* Category Select */}
            <div className="form-group category-group">
              <label htmlFor="category-select" className="form-label">
                Category
              </label>
              <select
                id="category-select"
                className="category-select"
                value={category}
                onChange={handleCategoryChange}
                aria-label="Product category filter"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <span className="select-icon">
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>

            {/* Search Input */}
            <div className="form-group search-group">
              <label htmlFor="search-input" className="form-label">
                Search
              </label>
              <div className="search-input-wrapper">
                <span className="search-icon">
              
                </span>
                <input
                  id="search-input"
                  type="text"
                  className="search-input"
                  placeholder="Search products, brands and more..."
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search for products"
                />
                {searchText && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="form-group button-group">
             
            </div>
          </form>
        </div>
      </div>

      {/* Product Display */}
      <div className="products-section">
        <ProductDisplay category={category} searchText={debouncedSearch} />
      </div>
    </div>
  );
};

export default ExploreProduct;
