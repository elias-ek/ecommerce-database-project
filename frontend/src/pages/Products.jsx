import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCategories, fetchBrands } from "../api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "../components/Products.module.css";


// Component displaying a list of products with filtering options
// with the ability to add products to the cart or view product details
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({ category: "", brand: "" });
  const { addToCart } = useCart();
  const navigate = useNavigate();

// Fetch categories and brands from the server
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    fetchBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

    // Fetch products based on selected filters
  useEffect(() => {
    const appliedFilters = {};
    if (filters.category) appliedFilters.category = filters.category;
    if (filters.brand) appliedFilters.brand = filters.brand;

    fetchProducts(appliedFilters)
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch(() => setProducts([]));
  }, [filters]);

  return (
    <div className={styles.container}>
      <h1>Products</h1>

      <div className={styles.filters}>
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          aria-label="Filter by Category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filters.brand}
          onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
          aria-label="Filter by Brand"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((p, idx) => {
          
            const id = p.ProductID || p.id || p._id || idx;
            const name = p.Name || p.name || "Unnamed";
            const price = p.Price ?? p.price;
            return (
              <div key={id} className={styles.card}>
                <h2>{name}</h2>
                <p>${!isNaN(Number(price)) ? Number(price).toFixed(2) : "N/A"}</p>
                <div className={styles.buttons}>
                  <button onClick={() => navigate(`/details/${id}`)}>Details</button>
                  <button onClick={() => addToCart({
                    id: p.ProductID || p.id || p._id,
                    name: p.Name || p.name,
                    price: p.Price ?? p.price,
                    ...p
                  })}>Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
