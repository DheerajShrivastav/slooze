"use client";

import { useState } from "react";
import Link from "next/link";

// Mock cart data
const initialCartItems = [
  {
    id: "1",
    menuItemId: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    price: 12.99,
    quantity: 2,
    imageUrl: "🍕",
    restaurantName: "Pizza Paradise",
  },
  {
    id: "2",
    menuItemId: "3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan and croutons",
    price: 8.99,
    quantity: 1,
    imageUrl: "🥗",
    restaurantName: "Pizza Paradise",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return cartItems.length > 0 ? 2.99 : 0;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic with GraphQL
    console.log("Proceeding to checkout");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-4xl">🍕</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                Slooze
              </h1>
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Your Cart 🛒
        </h2>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center animate-bounce-in">
            <div className="text-8xl mb-6">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8">
              Add some delicious items to get started!
            </p>
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                Browse Restaurants
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{item.imageUrl}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.restaurantName}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <span className="text-2xl">×</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-[#FF6B35]">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-3 bg-[#FFE5DB] rounded-full px-3 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-white rounded-full font-bold text-[#FF6B35] hover:shadow-md transition-all"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full font-bold text-white hover:shadow-md transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${getSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      ${getDeliveryFee().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">
                      ${getTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-[#FF6B35]">
                        ${getTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Delivery Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your address..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!deliveryAddress.trim()}
                  className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  Proceed to Checkout 🚀
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    🔒 Secure checkout with encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
