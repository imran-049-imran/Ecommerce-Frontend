import React, { useContext, useState } from "react";
import "./ExploreProduct.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";

const categories = [
  "Accessories",
  "Art Supplies",
  "Baby Products",
  "Bags",
  "Bakery",
  "Bath",
  "Beauty",
  "Books",
  "Electronics",
  "Fashion",
  "Home & Furniture",
  "Toys & Games",
  "Mobiles",
  "Grocery",
];

const ExploreProduct = () => {
  const { productList } = useContext(StoreContext);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Filter products by search + category
  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchCategory = activeCategory
      ? p.category.toLowerCase() === activeCategory.toLowerCase()
      : true;

    return matchSearch && matchCategory;
  });

  //  Dynamic heading
  const headingText = activeCategory
    ? `Showing ${activeCategory}`
    : "All Products";

  return (
    <div className="explore-page">
      {/* 🔍 Search Bar */}
      <div className="top-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="content-area">
        {/* 📂 Category Sidebar */}
        <aside className="category-sidebar">
          <h5>Categories</h5>
          <ul>
            <li
              className={!activeCategory ? "active" : ""}
              onClick={() => setActiveCategory("")}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* 🛒 Products */}
        <main className="product-section">
          <h4>{headingText}</h4>

          {filteredProducts.length === 0 ? (
            <p className="no-product">No products found</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExploreProduct;
