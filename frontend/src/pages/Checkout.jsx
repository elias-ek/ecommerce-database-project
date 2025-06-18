import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api";
import { Navigate } from "react-router-dom";

// Component that handles the checkout process, querying the backend for order creation and user authentication.
const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [user, setUser] = useState({ username: "", password: "", paymentmethod: "" });
  const [message, setMessage] = useState("");

// Function to handle the checkout process
const handleCheckout = async () => {
    
    //require user to select a payment method
    if (!user.paymentmethod) {
        setMessage("Please select a payment method.");
        return;
    }
    
    const response = await createOrder({
        username: user.username,
        password: user.password,
        items: cart,
        paymentmethod: user.paymentmethod
    });

    // If the order is successful, clear the cart and display a success message
    // If the order fails, display an error message
    if (response.orderID) {
        clearCart();
        setMessage(`Order #${response.orderID} placed! Total: $${response.totalAmount}`);
    } else {
        setMessage("Checkout failed: " + JSON.stringify(response));
    }
};

  return (
    <div className="p-4">
      <h1>Checkout</h1>
      <input placeholder="Username" onChange={e => setUser({ ...user, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setUser({ ...user, password: e.target.value })} />
      <select value={user.paymentmethod} onChange={e => setUser({ ...user, paymentmethod: e.target.value })}>
        <option value="" disabled>Select a payment method</option>
        <option value="card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="cash">Cash</option>
      </select>
      <button onClick={handleCheckout}>Submit Order</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Checkout;
