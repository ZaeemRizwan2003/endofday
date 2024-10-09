import React, { useContext } from "react";
import { useCart } from "@/pages/cartcontext";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/router";

const Cart = () => {
  const { cart,  incrementItemQuantity, decrementItemQuantity, removeFromCart, clearCart } = useCart();
  const router= useRouter();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = () => {
    router.push("/checkout");
  };

   return (
    <div className="fixed top-0 right-0 w-86 h-full bg-white shadow-lg z-50 p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 && <p className="text-gray-500">Your cart is empty</p>}
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-2">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{item.title}</span>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => decrementItemQuantity(item.id)}
                disabled={item.quantity <= 1} // Disable if quantity is 1
              >
                <FaRegMinusSquare />
              </button>
              <span className="px-1">{item.quantity}</span>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => incrementItemQuantity(item.id)}
              >
                <FaRegPlusSquare />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-purple-800 font-bold ml-1">Rs.{(item.price * item.quantity).toFixed(2)}</span>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => removeFromCart(item.id)}
              >
                <RiDeleteBin2Line />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="font-bold mt-6 border-t pt-4 text-lg">
          Total: Rs. {totalPrice}
        </div>
      )}

      {/* Clear Cart Button */}
      {cart.length > 0 && (
        <div className="mt-6">
          <button
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="mt-2">
          <button className="w-full py-2 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-900" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;