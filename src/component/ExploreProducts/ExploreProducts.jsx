import React, { useContext, useState, useCallback, useMemo } from "react";
import "./ExploreProduct.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";

// ─── Icons (inline SVG — no extra dependency) ────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// ─── Category list (defined outside component — never re-created) ─────────────
const CATEGORIES = [
  "Accessories", "Art Supplies", "Baby Products", "Bags", "Bakery",
  "Bath", "Beauty", "Books", "Electronics", "Fashion",
  "Home & Furniture", "Mobiles", "Toys & Games", "Grocery",
];

// ─── Component ────────────────────────────────────────────────────────────────
const ExploreProduct = () => {
  const { productList } = useContext(StoreContext);

  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [viewMode, setViewMode]           = useState("grid"); // "grid" | "list"

  // Memoised filter — only re-runs when deps change
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return productList.filter((p) => {
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCategory = !activeCategory ||
        p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [productList, search, activeCategory]);

  const handleClear = useCallback(() => setSearch(""), []);
  const handleCategory = useCallback((cat) => setActiveCategory(cat), []);

  // Heading text
  const heading = activeCategory
    ? activeCategory
    : search
    ? `Results for "${search}"`
    : "All Products";

  return (
    <div className="ep-page">

      {/* ── Top Search Bar ── */}
      <div className="ep-topbar">
        <div className="ep-search-wrap">
          <span className="ep-search-ico"><SearchIcon /></span>
          <input
            type="search"
            className="ep-search-input"
            placeholder="Search products, brands and more…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            autoComplete="off"
          />
          {search && (
            <button className="ep-clear-btn" onClick={handleClear} aria-label="Clear search">
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Category Chips (replaces hidden sidebar) ── */}
      <div className="ep-chips-bar" role="navigation" aria-label="Product categories">
        <button
          className={`ep-chip ${!activeCategory ? "ep-chip--active" : ""}`}
          onClick={() => handleCategory("")}
        >All</button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`ep-chip ${activeCategory === cat ? "ep-chip--active" : ""}`}
            onClick={() => handleCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {/* ── Main Layout ── */}
      <div className="ep-layout">

        {/* Sidebar — desktop only */}
        <aside className="ep-sidebar" aria-label="Category filter">
          <div className="ep-sidebar-header">
            <span className="ep-sidebar-title">Categories</span>
            {activeCategory && (
              <button className="ep-sidebar-clear" onClick={() => handleCategory("")}>
                Clear
              </button>
            )}
          </div>
          <ul role="list">
            <li
              role="listitem"
              className={`ep-sidebar-item ${!activeCategory ? "ep-sidebar-item--active" : ""}`}
              onClick={() => handleCategory("")}
            >
              All Products
              <span className="ep-sidebar-count">{productList.length}</span>
            </li>
            {CATEGORIES.map((cat) => {
              const count = productList.filter(
                (p) => p.category.toLowerCase() === cat.toLowerCase()
              ).length;
              return (
                <li
                  key={cat}
                  role="listitem"
                  className={`ep-sidebar-item ${activeCategory === cat ? "ep-sidebar-item--active" : ""}`}
                  onClick={() => handleCategory(cat)}
                >
                  {cat}
                  {count > 0 && <span className="ep-sidebar-count">{count}</span>}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product panel */}
        <main className="ep-main">

          {/* Toolbar */}
          <div className="ep-toolbar">
            <div className="ep-toolbar-left">
              <h2 className="ep-heading">{heading}</h2>
              <span className="ep-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>
            </div>
            <div className="ep-view-toggle" role="group" aria-label="View mode">
              <button
                className={`ep-view-btn ${viewMode === "grid" ? "ep-view-btn--active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                title="Grid view"
              ><GridIcon /></button>
              <button
                className={`ep-view-btn ${viewMode === "list" ? "ep-view-btn--active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                title="List view"
              ><ListIcon /></button>
            </div>
          </div>

          {/* Product grid / list */}
          {filteredProducts.length === 0 ? (
            <div className="ep-empty">
              <div className="ep-empty-icon">
                <SearchIcon />
              </div>
              <p className="ep-empty-title">No products found</p>
              <p className="ep-empty-sub">
                Try a different keyword or browse all categories
              </p>
              {(search || activeCategory) && (
                <button
                  className="ep-empty-reset"
                  onClick={() => { setSearch(""); setActiveCategory(""); }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className={`ep-grid ${viewMode === "list" ? "ep-grid--list" : ""}`}>
              {filteredProducts.map((product) => (
                <ProductItem key={product._id ?? product.id} product={product} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ExploreProduct;
