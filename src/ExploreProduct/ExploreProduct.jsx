import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { categories } from "../../assets/assest";
import "./ExploreProduct.css";

// ─── "All" category prepended so users can reset the filter ──────────────────
const ALL_CATEGORIES = [
  { name: "All", icon: null },
  ...categories,
];

// ─── Skeleton card (shown while images load) ──────────────────────────────────
const CategorySkeleton = () => (
  <div className="explore__item explore__item--skeleton" aria-hidden="true">
    <div className="explore__skeleton-img" />
    <div className="explore__skeleton-label" />
  </div>
);

// ─── Single category button — memoized so only changed items re-render ────────
const CategoryItem = React.memo(({ item, isActive, onSelect }) => (
  <button
    role="listitem"
    className={`explore__item ${isActive ? "explore__item--active" : ""}`}
    onClick={() => onSelect(item.name)}
    aria-pressed={isActive}
    aria-label={`Filter by ${item.name}`}
  >
    <div className="explore__img-wrap">

      {/* "All" uses an SVG grid icon; real categories use their image */}
      {item.icon ? (
        <img
          src={item.icon}
          alt=""              /* decorative — label carries the meaning */
          className="explore__img"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span className="explore__all-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3"  y="3"  width="7" height="7" rx="1" />
            <rect x="14" y="3"  width="7" height="7" rx="1" />
            <rect x="3"  y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
      )}

      {/* Checkmark badge — pops in when active */}
      {isActive && (
        <span className="explore__check" aria-hidden="true">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>

    <span className="explore__label">{item.name}</span>

    {/* Product count badge (optional — pass productCounts prop) */}
    {item.count != null && (
      <span className="explore__count">{item.count}</span>
    )}
  </button>
));

CategoryItem.displayName = "CategoryItem";

// ─── Main Component ───────────────────────────────────────────────────────────
const ExploreProduct = ({ category, setCategory, productCounts = {} }) => {
  const scrollRef  = useRef(null);
  const [canLeft,   setCanLeft]   = useState(false);
  const [canRight,  setCanRight]  = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Enrich categories with live product counts if provided by parent
  const enrichedCategories = useMemo(
    () =>
      ALL_CATEGORIES.map((cat) => ({
        ...cat,
        count: cat.name === "All" ? null : (productCounts[cat.name] ?? null),
      })),
    [productCounts]
  );

  // Skeleton → real content on mount
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Arrow visibility: recalc on scroll + resize ──
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = useCallback((direction) => {
    scrollRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }, []);

  // Toggle: re-clicking active category resets to "All"
  const handleSelect = useCallback(
    (name) => setCategory((prev) => (prev === name ? "All" : name)),
    [setCategory]
  );

  return (
    <section className="explore" aria-label="Product categories">

      {/* ── Header ── */}
      <div className="explore__header">
        <div className="explore__header-text">
          <h2 className="explore__title">Explore Our Products</h2>
          <p className="explore__subtitle">
            {category === "All"
              ? "Browse products from top categories"
              : `Browsing "${category}" — click again to show all`}
          </p>
        </div>

        <div className="explore__controls">
          <button
            className="explore__arrow"
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            aria-label="Scroll categories left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="explore__arrow"
            onClick={() => scroll(1)}
            disabled={!canRight}
            aria-label="Scroll categories right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable Category List ── */}
      <div
        className="explore__track"
        ref={scrollRef}
        role="list"
        aria-label="Category filters"
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <CategorySkeleton key={i} />)
          : enrichedCategories.map((item) => (
              <CategoryItem
                key={item.name}
                item={item}
                isActive={category === item.name}
                onSelect={handleSelect}
              />
            ))}
      </div>

      {/* ── Active filter pill + clear button ── */}
      {category !== "All" && !isLoading && (
        <div className="explore__active-bar" aria-live="polite">
          <span className="explore__active-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {category}
          </span>

          <button
            className="explore__clear"
            onClick={() => setCategory("All")}
            aria-label="Clear category filter"
          >
            Clear filter ✕
          </button>
        </div>
      )}

      <div className="explore__divider" role="separator" />
    </section>
  );
};

export default ExploreProduct;
