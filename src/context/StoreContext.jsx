import React, { createContext, useEffect, useState, useMemo } from "react";
import { fetchProductList } from "../Service/productService";
import { addToCart, getCartData, removeFromCart } from "../Service/cartService";

export const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const [productList, setProductList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [quantities, setQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || {};
  });

  const [globalSearch, setGlobalSearch] = useState("");

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetchProductList();

        const normalized = (res || []).map((p) => ({
          ...p,
          id: p.id ?? p.productId,
          category: (p.category || "").toLowerCase().trim(),
          imageUrl: p.imageUrl || p.image || "",
          name: p.name || "",
          price: Number(p.price ?? 0),
          rating: p.rating ?? null,
          discount: p.discount ?? null,
          description: p.description || "",
        }));

        setProductList(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= LOAD CART ================= */
  const loadCartData = async (userToken) => {
    try {
      const backendCart = await getCartData(userToken);
      if (backendCart && Object.keys(backendCart).length > 0) {
        setQuantities(backendCart);
        localStorage.setItem("cartItems", JSON.stringify(backendCart));
      }
    } catch (err) {
      console.error("Cart load failed", err);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadCartData(token);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(quantities));
  }, [quantities]);

  /* ================= CART ACTIONS ================= */
  const addItem = async (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

    if (token) {
      try {
        await addToCart(productId, token);
      } catch (err) {
        console.error("Add to cart failed", err);
      }
    }
  };

  const increaseQty = async (productId) => {
    await addItem(productId);
  };

  const decreaseQty = async (productId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      if (updated[productId] <= 1) delete updated[productId];
      else updated[productId] -= 1;
      return updated;
    });

    if (token) {
      await removeFromCart(productId, token);
    }
  };

  const removeItem = async (productId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });

    if (token) {
      try {
        await removeFromCart(productId, token);
      } catch (err) {
        console.error("Failed to remove item", err);
      }
    }
  };

  const clearCart = () => {
    setQuantities({});
    localStorage.removeItem("cartItems");
  };

  const logout = () => {
    setToken("");
    setQuantities({});
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
  };

  /* ================= DERIVED VALUES ================= */
  const cartCount = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + b, 0),
    [quantities]
  );

  const cartTotal = useMemo(() => {
    return productList.reduce((sum, p) => {
      return sum + (quantities[p.id] || 0) * p.price;
    }, 0);
  }, [productList, quantities]);

  /* ================= CONTEXT VALUE ================= */
  return (
    <StoreContext.Provider
      value={{
        productList,
        loadingProducts,
        error,
        quantities,
        cartCount,
        cartTotal,
        addItem,        // ✅ new function for Add to Cart
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        token,
        setToken,
        logout,
        globalSearch,
        setGlobalSearch,
        setQuantities,
        loadCartData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
