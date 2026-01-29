import React, { useState } from "react";
import "./Home.css";
import Header from "../component/Header/Header";
import ExploreProducts from "../component/ExploreProducts/ExploreProducts";

import mobile from "../assets/mobile.png";
import electronics from "../assets/electronic.png";
import fashion from "../assets/cloth.png";
import furniture from "../assets/furniture.png";
import beauty from "../assets/beauty.png";
import toys from "../assets/toys.png";

const Home = () => {

  

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const categories = [
    { id: 1, name: "Mobiles", key: "mobile", image: mobile, offer: "Up to 20% off" },
    { id: 2, name: "Electronics", key: "electronics", image: electronics, offer: "Top Deals" },
    { id: 3, name: "Fashion", key: "fashion", image: fashion, offer: "Min 30% off" },
    { id: 4, name: "Furniture", key: "furniture", image: furniture, offer: "Big Savings" },
    { id: 5, name: "Beauty", key: "beauty", image: beauty, offer: "Best Sellers" },
    { id: 6, name: "Toys", key: "toys", image: toys, offer: "Kids Choice" },
  ];

  

  const handleCategoryClick = (key) => {
    setCategory(key);
  };

  

  return (
    <div className="home-container">
      {/* HEADER */}
      <Header />

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-box ${
                category === cat.key ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <span className="offer-badge">{cat.offer}</span>

              <div className="image-wrapper">
                <img src={cat.image} alt={cat.name} />
              </div>

              <h5>{cat.name}</h5>
            </div>
          ))}
        </div>
      </section>


      {/* PRODUCTS */}
      <div id="product-section">
        <ExploreProducts category={category} search={search} />
      </div>
    </div>
  );
};

export default Home;
