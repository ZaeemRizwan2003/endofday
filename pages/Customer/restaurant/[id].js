import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaRegMinusSquare } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import DashNav from "@/Components/CustomerNavbar";
import { useCart } from "../cartcontext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { LuLoader } from "react-icons/lu";

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart, incrementItemQuantity, decrementItemQuantity, cart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/Customer/restaurants/${id}`)
        .then((response) => setRestaurant(response.data))
        .catch((error) => console.error(error));
    }
    console.log(restaurant)
  }, [id]);

  // useEffect(() => {
  //   const savedAddedToCart = JSON.parse(localStorage.getItem("addedToCart")) || {};
  //   setAddedToCart(savedAddedToCart);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("addedToCart", JSON.stringify(addedToCart));
  // }, [addedToCart]);

  const handleAddToCart = (itemId, title, price) => {
    addToCart(itemId, title, price);
    setAddedToCart((prev) => ({ ...prev, [itemId]: true }));

    toast.success(`${title} added to cart successsfully`, { autoClose: 1000 });
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((cartItem) => cartItem.id === itemId);
    return cartItem ? cartItem.quantity : 1;
  };

  if (!restaurant) return <p> <LuLoader /> </p>;


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
              <img
                src={`data:${restaurant.imageContentType};base64,${restaurant.image}`} alt={item.itemname}
                className="w-1/4 object-cover "
              />
              <div className="p-4 w-3/4">
                <h2 className="text-xl font-bold text-purple-800 mb-2">
                  {item.itemname}
                </h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-red font-bold">${item.discountedprice}</p>
                <p className="text-purple-800 font-bold">${item.price}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">

                    {cart ? (
                      <>
                        <button
                          onClick={() => decrementItemQuantity(item._id)}
                          disabled={getItemQuantity(item._id) <= 1}
                        // disabled={cart.quantity <= 1}
                        // disabled={!cart[item._id]?.quantity || cart[item._id]?.quantity <= 1

                        >
                          <FaRegMinusSquare />
                        </button>

                        <span className="px-4">
                          {getItemQuantity(item._id)}
                          {/* {cart.quantity} */}
                          {/* {cart[item._id]?.quantity || 1} */}
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
                    onClick={() => handleAddToCart(item._id, item.itemname, item.price)}
                  >
                    Add to Cart
                    {/* {addedToCart[item._id] ? "Added to Cart" : "Add to Cart"} */}
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
