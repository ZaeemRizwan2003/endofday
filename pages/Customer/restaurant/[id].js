import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import DashNav from "@/Components/CustomerNavbar";
import { useCart } from "../cartcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuLoader } from "react-icons/lu"; // Spinner icon

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const {
    addToCart,
    incrementItemQuantity,
    decrementItemQuantity,
    cart,
    setCart,
  } = useCart();
  const [addedToCart, setAddedToCart] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      loadCartFromServer(userId).then((fetchedCart) => {
        setCart(fetchedCart);
      });
    }
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true); // Start loading
      axios
        .get(`/api/Customer/restaurants/${id}`)
        .then((response) => {
          setRestaurant(response.data);
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Stop loading even on error
        });
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
        throw new Error("Failed to fetch cart data");
      }

      const data = await response.json();
      return Array.isArray(data.cartItems) ? data.cartItems : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  };

  const handleAddToCart = (itemId, title, price, bakeryId) => {
    addToCart(itemId, title, price, bakeryId);
    setAddedToCart((prev) => ({ ...prev, [itemId]: true }));
    toast.success(`${title} added to cart successfully`, {
      autoClose: 1000,
      position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((item) => item.itemId === itemId);
    return cartItem ? cartItem.quantity : 1;
  };

  return (
    <>
      <ToastContainer />
      <DashNav />
      <div className="p-14 justify-center">
        {loading ? (
          // Loading spinner while fetching data
          <div className="flex justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-5xl" />
            <span className="ml-4 text-lg text-purple-800 font-semibold">
              Loading...
            </span>
          </div>
        ) : (
          <>
            {/* Restaurant Details */}
            <div className="flex mb-8 mt-12">
              <div className="w-2/3">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">
                  {restaurant?.restaurantName}
                  <button
                    className="ml-4 px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-600 transition"
                    onClick={() =>
                      router.push(`/Customer/RestaurantReview?id=${id}`)
                    }
                  >
                    Reviews
                  </button>
                </h1>
                <p className="text-lg mb-2">{restaurant?.address}</p>
                <p className="text-gray-600">{restaurant?.description}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {restaurant?.menu?.length > 0 ? (
                restaurant.menu.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col border rounded-lg overflow-hidden shadow-lg hover:shadow-md transition duration-300"
                  >
                    <div className="p-4 flex flex-col justify-between h-full w-full">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-purple-800 mb-2">
                          {item.itemname}
                        </h2>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <p className="text-red-800 font-bold line-through">
                          Rs.{item.price}
                        </p>
                        <p className="text-red font-bold">
                          Rs.{item.discountedprice}
                        </p>

                        {item.remainingitem < 200 && (
                          <p className="text-orange-600 font-semibold">
                            Only {item.remainingitem} left in stock!
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center">
                        <button
                          className="bg-purple-800 text-white rounded px-4 py-2 mr-6"
                          onClick={() =>
                            handleAddToCart(
                              item._id,
                              item.itemname,
                              item.discountedprice,
                              item.remainingitem,
                              item.bakeryId
                            )
                          }
                        >
                          Add to Cart
                        </button>
                        <div className="flex items-center">
                          {cart ? (
                            <>
                              <button
                                onClick={() => decrementItemQuantity(item._id)}
                              >
                                <FaRegMinusSquare />
                              </button>
                              <span className="px-4">
                                {getItemQuantity(item._id)}
                              </span>
                              <button
                                onClick={() =>
                                  incrementItemQuantity(
                                    item._id,
                                    item.remainingitem
                                  )
                                }
                              >
                                <FaRegPlusSquare />
                              </button>
                            </>
                          ) : (
                            <span className="px-4">1</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No menu items available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RestaurantMenu;
