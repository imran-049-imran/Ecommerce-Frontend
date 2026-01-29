import React, { useState, useEffect } from "react";
import ProductDisplay from "../component/ProductDisplay/ProductDisplay";
import "./ExploreProduct.css";

const ExploreProduct = () => {
  const [category, setCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

 
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

  return (
    <div className="explore-wrapper">
      {/* 🔍 SEARCH BAR */}
      <div className="explore-search container">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands and more..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button type="button" className="search-btn">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      <ProductDisplay category={category} searchText={debouncedSearch} />
    </div>
  );
};

export default ExploreProduct;
