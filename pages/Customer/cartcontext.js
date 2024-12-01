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

  const syncCartToServer = async (userId, cart) => {
    try {
      const response = await fetch("/api/Customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cart }),
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

  const addToCart = async (itemId, title, price, remainingitem) => {
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array");
      setCart([]); // Reset to empty array if something went wrong
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.itemId === itemId);

    if (existingItem) {
      if (existingItem.quantity >= remainingitem) {
        alert("Cannot add more than the available stock");
        return;
      }

      const updatedCart = cart.map((cartItem) =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      await syncCartToServer(localStorage.getItem("userId"), updatedCart);
    } else {
      if (remainingitem < 1) {
        alert("Item is out of stock");
        return;
      }

      const newItem = { itemId, title, price, quantity: 1 };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      await syncCartToServer(localStorage.getItem("userId"), updatedCart);
    }
  };

  const incrementItemQuantity = async (itemId, remainingitem) => {
    const itemInCart = cart.find((item) => item.itemId === itemId);

    if (itemInCart.quantity >= remainingitem) {
      alert("Cannot add more than the available stock");
      return;
    }

    const updatedCart = cart.map((item) =>
      item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const decrementItemQuantity = async (itemId) => {
    const updatedCart = cart
      .map((item) =>
        item.itemId === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Remove item if quantity is 0
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.itemId !== itemId));
  };

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
