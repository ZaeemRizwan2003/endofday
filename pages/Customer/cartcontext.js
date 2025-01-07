import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

    const fetchUserCart = async (userId) => {
      if (!userId) {
        setCart([]);
        return;
      }

        try {
          const response = await fetch(`/api/Customer/cart?userId=${userId}`);
          if (response.ok) {
            const { cart } = await response.json();
            setCart(cart || []);
            if (cart && cart.length > 0) {
              setCurrentRestaurantId(cart[0].bakeryId);
            }
            localStorage.setItem("cart", JSON.stringify(cart || []));

          } else {
            console.error("Failed to fetch cart for user:", userId);
            setCart([]); // Reset cart on error
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCart([]); // Reset cart on error
        }
    };

  const syncCartToServer = async (userId, cart) => {
    if(!userId) return;

    try {
      // Ensure the cart contains bakeryId for all items
      const enrichedCart = cart.map((item) => {
        if (!item.bakeryId) {
          console.warn(`Missing bakeryId for item: ${item.itemId}`);
        }
        return item;
      });

      const response = await fetch("/api/Customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cart: enrichedCart }), // Send enriched cart with bakeryId
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server responded with an error:", errorResponse.message);
        throw new Error("Failed to sync cart to server");
      }

      const data = await response.json();
      console.log("Cart synced to server successfully:", data);
      return data; // Return the server response if needed
    } catch (error) {
      console.error("Error syncing cart to server:", error.message);
      throw error; // Rethrow error to handle it further up the call stack
    }
  };

  const isStockAvailable = (itemId, remainingitem) => {
    const existingItem = cart.find((cartItem) => cartItem.itemId === itemId);
    if (existingItem && existingItem.quantity >= remainingitem) {
      return false; // No stock available
    }
    return true; // Stock available
  };

  const addToCart = async (itemId, title, price, remainingitem, bakeryId) => {
    if (!isStockAvailable(itemId, remainingitem)) {
      alert("Cannot add more than the available stock");
      return;
    }

    if (currentRestaurantId && currentRestaurantId !== bakeryId && cart.length > 0) {
      setPendingItem({ itemId, title, price, remainingitem, bakeryId });
      setShowConfirmationModal(true);
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.itemId === itemId);

      const updatedCart = existingItem
       ? cart.map((cartItem) =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    : [...cart, { itemId, title, price, quantity: 1, bakeryId }];

    if (cart.length === 0) {
      setCurrentRestaurantId(bakeryId);
    }
      setCart(updatedCart);
    
        const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, updatedCart);
    };

    const handleConfirmClearCart = async () => {
      setCart([]);
      setCurrentRestaurantId(pendingItem.bakeryId);
      setShowConfirmationModal(false);
      if (pendingItem) {
        await addToCart(
          pendingItem.itemId,
          pendingItem.title,
          pendingItem.price,
          pendingItem.remainingitem,
          pendingItem.bakeryId
        );
        setPendingItem(null);
      }
    };

    const handleCancelAdd = () => {
      setShowConfirmationModal(false);
      setPendingItem(null);
    };

  const incrementItemQuantity = async (itemId, remainingitem) => {
    const existingItem = cart.find((item) => item.itemId === itemId);

    if (!existingItem) {
      console.warn(`Item with ID ${itemId} not found in cart.`);
      return;
    }
  
    if (existingItem.quantity >= remainingitem) {
      alert(`Cannot add more than the available stock (${remainingitem} items).`);
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
      .filter((item) => item.quantity > 0); // Remove item if quantity becomes 0
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const removeFromCart = async (itemId) => {
     const updatedCart = cart.filter((item) => item.itemId !== itemId);
    setCart(updatedCart);
    const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, []);
  };

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  const handleUserChange = () => {
    const userId = localStorage.getItem("userId");
    fetchUserCart(userId);
  };

  useEffect(() => {
    handleUserChange();
  }, []);


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
        fetchUserCart,
        currentRestaurantId
        
      }}
    >
      {children}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">
              Change Restaurant?
            </h2>
            <p className="text-gray-600 mb-4">
              Adding items from another restaurant will clear your current cart.
              Do you want to proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleConfirmClearCart}
              >
                Yes, Clear Cart
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelAdd}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
