import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

// Add to Cart
export const addToCart = async(productId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}`, { productId }, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;

    } catch (error) {
        console.error("Error while adding to cart:", error);
        throw error;
    }
};

export const removeFromCart = async(productId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/remove`, { productId }, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error while removing from cart:", error);
        throw error;
    }
};

export const getCartData = async(token) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.items;
    } catch (error) {
        console.error("Error while fetching cart data:", error);
        throw error;
    }
};