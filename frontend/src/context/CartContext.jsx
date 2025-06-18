import { createContext, useContext, useState } from "react";


//context that manages the state of the shopping cart and functions to manipulate it
const CartContext = createContext();

// CartProvider component that wraps the application and provides the cart context
// uses the useState hook to manage the cart state and provides functions to add and remove individual items, and clearing the cart
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.name]: (prev[product.name] || 0) + 1
    }));
    alert(`${product.name} added to cart!`);
  };

  // Function to remove a product from the cart
  const removeFromCart = (product) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[product.name];
      return newCart;
    });
    alert(`${product.name} removed from cart!`);
  };

  // Function to clear the entire cart
  const clearCart = () =>{ setCart({}) };

  // Provide the cart state and functions to the children components
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext in other components
export const useCart = () => useContext(CartContext);
