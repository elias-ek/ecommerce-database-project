import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";


// Component for displaying detailed product information
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

    // Fetch product details from the server using the product ID from the URL
    useEffect(() => {
        fetch(`http://localhost:5000/products`)
            .then(res => res.json())
            .then(data => setProduct(data.find(p => String(p.ProductID) === String(id))));
    }, [id]);

    // If product is not found, show a loading message
    if (!product) return <div>Loading...</div>;

    return (
    <div className="p-4">
        <h1>{product.Name}</h1>
        <p>${product.Price}</p>
        <p>{product.Description}</p>
        <p>Stock: {product.StockQuantity}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
    );
};

export default ProductDetails;
