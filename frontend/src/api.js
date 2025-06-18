const BASE_URL = "http://localhost:5000"; // adjust if needed

// Collection of functions to interact with the backend API

// Function to fetch products from the server with optional filters
export const fetchProducts = async (filters) => {
try {
    const params = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${BASE_URL}/products?${params}`);
    
    if (response.status === 204) {
        return []; // No products found, return empty list
    }

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json(); // Only parse JSON if response has content
} catch (err) {
    console.error("fetchProducts exception:", err);
    return { error: err.message };
}
};


// Function to create a new order
export const createOrder = async (orderData) => {
    console.log("Creating order with data:", orderData);
    try {
    const response = await fetch("http://localhost:5000/createorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Order creation error response:", errorText);
      throw new Error(`Order creation failed: ${response.status} ${errorText}`);
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn("Expected JSON, got:", text);
      return { error: "Unexpected response format", raw: text };
    }

  } catch (err) {
    console.error("createOrder exception:", err);
    return { error: err.message };
  }
};



// Function to fetch categories from the server
export const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (err) {
    console.error("fetchCategories exception:", err);
    return { error: err.message };
  }
};

// Function to fetch brands from the server
export const fetchBrands = async () => {
  try {
    const res = await fetch("http://localhost:5000/brands");
    if (!res.ok) throw new Error("Failed to fetch brands");
    return await res.json();
  } catch (err) {
    console.error("fetchBrands exception:", err);
    return { error: err.message };
  }
};
