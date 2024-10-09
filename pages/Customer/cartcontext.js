import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id, title,price) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === id
    );
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, {id, title, price, quantity: 1 }]);
    }
  };

  const incrementItemQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const itemIndex = updatedCart.findIndex(item => item.id === id);
  
      if (itemIndex >= 0) {
        updatedCart[itemIndex].quantity += 1; // Increase quantity
      }
      
      return updatedCart;
    });
  };

  const decrementItemQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const itemIndex = updatedCart.findIndex(item => item.id === id);
  
      if (itemIndex >= 0 && updatedCart[itemIndex].quantity > 1) {
        updatedCart[itemIndex].quantity -= 1; // Decrease quantity
      }
  
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, incrementItemQuantity, decrementItemQuantity,removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
