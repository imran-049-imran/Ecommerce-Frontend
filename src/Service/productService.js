import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const fetchProductList = async() => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching product list:", error);
        throw error;
    }
};


export const fetchProductDetails = async(id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
};