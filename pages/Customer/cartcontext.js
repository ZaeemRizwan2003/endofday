import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]); // Reset if it's not an array
        }
      } catch (error) {
        console.error("Error parsing stored cart data:", error);
        setCart([]); // Reset to empty array on error
      }
    }
  }, []);

  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = async (itemId, title, price) => {
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array");
      setCart([]); // Reset to empty array if something went wrong
      return;
    }

    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.itemId === itemId
    );
    let updatedCart;

    if (existingItemIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1; // Increment quantity if item exists
      setCart(updatedCart);
    } else {
      const newItem = { itemId, title, price, quantity: 1 };
      updatedCart = [...cart, newItem];
      setCart(updatedCart);
    }
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const syncCartToServer = async (userId, cart) => {
    try {
      const response = await fetch("/api/Customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cart,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync cart to server");
      }

      const data = await response.json();
      console.log("Cart synced to server:", data);
    } catch (error) {
      console.error("Error syncing cart to server:", error);
    }
  };

  const incrementItemQuantity = async (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const decrementItemQuantity = async (itemId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Remove item if quantity is 0
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        incrementItemQuantity,
        decrementItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
