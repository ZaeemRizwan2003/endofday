import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import DashNav from "@/Components/CustomerNavbar";
import { useCart } from "../cartcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuLoader } from "react-icons/lu";

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

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
    const userId = localStorage.getItem("userId");
    if (id && userId) {
      setLoading(true);  // Start loading
      axios
        .get(`/api/Customer/restaurants/${id}`)
        .then((response) => {
          const restaurantData = response.data;
          console.log(restaurantData);

          // Filter out listings older than 24 hours
          const filteredMenu = restaurantData.menu.filter((item) => {
            const updatedAt = new Date(item.updatedAt);
            const currentTime = new Date();
            const timeDifference = currentTime - updatedAt;
            const hoursDifference = timeDifference / (1000 * 60 * 60); 
            return hoursDifference <= 24; 
          });

         
          const totalRating = restaurantData.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const avgRating = totalRating / restaurantData.reviews.length;

          setRestaurant({
            ...restaurantData,
            menu: filteredMenu, 
          });
          setAvgRating(avgRating);

          console.log("Average Rating:", avgRating); 
          

          setLoading(false); 
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); 
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
      if (!data.success) {
        throw new Error(data.message || "Failed to load cart");
      }

      return Array.isArray(data.cartItems) ? data.cart : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  };

  const handleAddToCart = (itemId, title, price, bakeryId, remainingitem) => {

    const currentQuantity = getItemQuantity(itemId);

    if (currentQuantity >= remainingitem) {
      toast.error(`Only ${remainingitem} items available in stock.`);
      return;
    }

    addToCart(itemId, title, price, remainingitem, bakeryId);
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/api/Customer/favorites?userId=${userId}`)
        .then((response) => setFavorites(response.data.favorites))
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, []);

  // Toggle Favorite Function
  const toggleFavorite = async (listingId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const isFavorite = favorites.some((fav) => fav._id === listingId);

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete("/api/Customer/favorites", {
          data: { userId, listingId },
        });

        setFavorites((prev) => prev.filter((fav) => fav._id !== listingId));
        toast.success("Removed from favorites!", { autoClose: 1000 });
      } else {
        // Add to favorites
        await axios.post("/api/Customer/favorites", { userId, listingId });

        setFavorites((prev) => [...prev, { _id: listingId }]);
        toast.success("Added to favorites!", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const isFavorite = (listingId) =>
    favorites.some((fav) => fav._id === listingId);

  return (
    <>
      <ToastContainer />
      <DashNav />
      <div className="p-20 justify-center">
        {loading ? (
          
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
              <div className="w-full bg-gray-100 p-4">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">
                  {restaurant?.restaurantName}
                  <span className="ml-4 text-yellow-500 font-semibold">
                    {avgRating.toFixed(1)} 
                    <span className="text-gray-400">/ 5</span>
                  </span>
                  <button
                    className="ml-10 p-2 text-white rounded hover:underline transition text-base justify-end bg-purple-800"
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
                    <div className="relative group border rounded-lg shadow-lg p-4 flex flex-col justify-between h-full">
                    {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.itemname}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )}

                     
                      <div className="flex-grow">
                      <div className="absolute top-30 right-5">
                        <button
                          onClick={() => toggleFavorite(item._id)}
                          className="mt-4 self-start"
                        >
                          {isFavorite(item._id) ? (
                            <FaHeart className="text-red-600 text-2xl" />
                          ) : (
                            <FaRegHeart className="text-gray-400 text-2xl" />
                          )}
                        </button>
                      </div>
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
                          className={`${
                            item.remainingitem > 0
                              ? "bg-purple-800 text-white"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          } rounded px-4 py-2 mr-6`}
                          onClick={() =>
                            handleAddToCart(
                              item._id,
                              item.itemname,
                              item.discountedprice,
                              item.bakeryId,
                              item.remainingItem
                            )
                          }
                          disabled={item.remainingitem <= 0 || addedToCart[item._id]}

                        >
                          {item.remainingitem > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>

                        

                        {addedToCart[item._id] && (
                          <div className="flex items-center">
                            <button
                              className="text-red-600 text-xl mr-2"
                              onClick={() => decrementItemQuantity(item._id)}
                            >
                              <FaRegMinusSquare />
                            </button>
                            <span className="font-semibold">
                              {getItemQuantity(item._id)}
                            </span>
                            <button
                              className={`text-green-600 text-xl ml-2 ${
                                getItemQuantity(item._id) >= item.remainingitem
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                              onClick={() => incrementItemQuantity(item._id, item.remainingItem)}
                              disabled={getItemQuantity(item._id) >= item.remainingitem}
                            >
                              <FaRegPlusSquare />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No menu items available</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RestaurantMenu;
