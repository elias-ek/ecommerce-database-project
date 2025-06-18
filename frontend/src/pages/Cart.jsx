import { useCart} from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// Component that displays the items in the cart, allows the user to remove items, clear the cart, and navigate to checkout.

const Cart = () => {
    const { cart = {}, clearCart, removeFromCart } = useCart();
    const navigate = useNavigate();
    
    // Convert the cart object to an array of entries (key-value pairs)
    const items = Object.entries(cart);

    // Sort the items alphabetically by name
    // If the cart is empty, display a message
    if (items.length === 0) return <div>Your cart is empty.</div>;
    if (items.length > 0) {
        items.sort((a, b) => a[0].localeCompare(b[0]));
    }
    return (
    <div className="p-4">
        <h1>Your Cart</h1>
        {items.map(([name, quantity]) => (
        <div 
            key={name}>{name} - x{quantity}
            <button className="ml-4" onClick={() => removeFromCart(name)}>X</button>
        </div>
        ))}

        <button className="mt-4" onClick={() => navigate("/checkout")}>Go to Checkout</button>
        <button
            className="mt-4"
            onClick={() => {
                clearCart();
                alert("Cart cleared!");
                navigate("/products");
            }}
        >
            Clear Cart
        </button>
    </div>
    );
};

export default Cart;
