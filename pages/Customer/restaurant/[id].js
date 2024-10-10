import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegMinusSquare } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import DashNav from "@/Components/CustomerNavbar";
import { useCart } from "../cartcontext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LuLoader } from "react-icons/lu";

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart, incrementItemQuantity, decrementItemQuantity, cart, setCart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      loadCartFromServer(userId).then(fetchedCart => {
        setCart(fetchedCart);
      });
    }
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/Customer/restaurants/${id}`)
        .then((response) => setRestaurant(response.data))
        .catch((error) => console.error(error));
    }
  }, [id]);

  const loadCartFromServer = async (userId) => {
    try {
      const response = await fetch(`/api/Customer/cart?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }
  
      const data = await response.json();
      return Array.isArray(data.cartItems) ? data.cartItems : []; 
 // Assuming the response contains cartItems
    } catch (error) {
      console.error("Error loading cart:", error);
      return []; // Return an empty cart if there's an error
    }
  };

  const handleAddToCart = (itemId, title, price) => {
    addToCart(itemId, title, price);
    setAddedToCart((prev) => ({ ...prev, [itemId]: true }));
    toast.success(`${title} added to cart successfully`, {
      autoClose: 1000,
      position: "bottom-right",  // This sets the toast to appear at the bottom-right
      hideProgressBar: false,    // Option to hide the progress bar, you can set it to `true` if needed
      closeOnClick: true,        // Option to close the toast on click
      pauseOnHover: true,        // Option to pause the timer on hover
      draggable: true,           // Option to make the toast draggable
    });
  };

  const getItemQuantity = (itemId) => {
    if (!Array.isArray(cart)) return 0; // Return 0 if cart is not an array
    const cartItem = cart.find((cartItem) => cartItem.id === itemId);
    return cartItem ? cartItem.quantity : 1; // Return 0 if item is not in the cart
};

  if (!restaurant) return <p> Loading....</p>;

  return (
    <>
      <ToastContainer />
      <DashNav />
      <div className="p-14 justify-center">
        <div className="flex mb-8 mt-12">
          <div className="w-2/3">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              {restaurant.restaurantName}
            </h1>
            <p className="text-lg mb-2">{restaurant.address}</p>
            <p className="text-gray-600">{restaurant.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {restaurant.menu.map((item) => (
            <div
              key={item._id}
              className="flex border rounded-lg overflow-hidden shadow-lg hover:shadow-md transition duration-300"
            >
              {/* Change to show each item's specific image */}
              {item.image && item.image.data && item.image.contentType && (
                <img
                  src={`data:${item.image.contentType};base64,${item.image.data}`}
                  alt={item.itemname}
                  className="w-1/4 object-cover "
                />
              )}
              <div className="p-4 w-3/4">
                <h2 className="text-xl font-bold text-purple-800 mb-2">
                  {item.itemname}
                </h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-red font-bold">Rs.{item.discountedprice}</p>
                <p className="text-red-800 font-bold line-through">Rs.{item.price}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {cart ? (
                      <>
                        <button
                          onClick={() => decrementItemQuantity(item._id)}
                          // disabled={getItemQuantity(item._id) <= 1}
                        >
                          <FaRegMinusSquare />
                        </button>
                        <span className="px-4">
                          {getItemQuantity(item._id)}
                        </span>
                        <button
                          onClick={() => incrementItemQuantity(item._id)}
                        >
                          <FaRegPlusSquare />
                        </button>
                      </>
                    ) : (
                      <span className="px-4">1</span>
                    )}
                  </div>
                  <button
                    className="bg-purple-800 text-white rounded px-4 py-2"
                    onClick={() => handleAddToCart(item._id, item.itemname, item.discountedprice)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RestaurantMenu;
