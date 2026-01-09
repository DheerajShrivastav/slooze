"use client";

import { useState } from "react";

// Mock data for demonstration
const restaurants = [
  {
    id: "1",
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "25-35 min",
    imageUrl: "🍕",
    description: "Authentic Italian pizzas with fresh ingredients",
  },
  {
    id: "2",
    name: "Burger Bonanza",
    cuisine: "American",
    rating: 4.6,
    deliveryTime: "20-30 min",
    imageUrl: "🍔",
    description: "Juicy burgers made with premium beef",
  },
  {
    id: "3",
    name: "Sushi Sensation",
    cuisine: "Japanese",
    rating: 4.9,
    deliveryTime: "30-40 min",
    imageUrl: "🍣",
    description: "Fresh sushi and Japanese delicacies",
  },
  {
    id: "4",
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.7,
    deliveryTime: "15-25 min",
    imageUrl: "🌮",
    description: "Authentic Mexican street food",
  },
  {
    id: "5",
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.8,
    deliveryTime: "25-35 min",
    imageUrl: "🍛",
    description: "Flavorful Indian curries and tandoori",
  },
  {
    id: "6",
    name: "Noodle Nation",
    cuisine: "Asian",
    rating: 4.5,
    deliveryTime: "20-30 min",
    imageUrl: "🍜",
    description: "Delicious Asian noodles and stir-fry",
  },
];

const categories = [
  { name: "Pizza", emoji: "🍕", color: "from-[#FF6B35] to-[#FFD23F]" },
  { name: "Burgers", emoji: "🍔", color: "from-[#FF6B9D] to-[#A64AC9]" },
  { name: "Sushi", emoji: "🍣", color: "from-[#4ECDC4] to-[#6BCF7F]" },
  { name: "Desserts", emoji: "🍰", color: "from-[#FFD23F] to-[#FF6B35]" },
  { name: "Drinks", emoji: "🥤", color: "from-[#A64AC9] to-[#4ECDC4]" },
  { name: "Salads", emoji: "🥗", color: "from-[#6BCF7F] to-[#4ECDC4]" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-4xl">🍕</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                Slooze
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">
                Restaurants
              </a>
              <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">
                Orders
              </a>
              <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">
                About
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block px-4 py-2 text-[#FF6B35] font-semibold hover:bg-[#FFE5DB] rounded-full transition-colors">
                Sign In
              </button>
              <button className="px-5 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFE5DB] via-[#FFF9F0] to-[#FFD23F]/20 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-bounce-in">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-[#FF6B35] via-[#A64AC9] to-[#4ECDC4] bg-clip-text text-transparent">
                  Hungry?
                </span>
                <br />
                <span className="text-gray-900">Order Now! 🎉</span>
              </h2>
            </div>
            <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto animate-slide-up">
              Get your favorite food delivered to your doorstep in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Enter your delivery address..."
                  className="w-full px-6 py-4 rounded-full border-2 border-[#FF6B35]/30 focus:border-[#FF6B35] focus:outline-none text-lg shadow-lg"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                  Find Food 🔍
                </button>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-gray-700">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">✨</span>
                <span className="font-semibold text-gray-700">Fresh Food</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-gray-700">Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What are you craving? 😋
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${category.color} hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  selectedCategory === category.name ? "ring-4 ring-offset-2 ring-[#FF6B35]" : ""
                }`}
              >
                <div className="text-5xl mb-2 group-hover:animate-wiggle">{category.emoji}</div>
                <div className="text-white font-bold text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900">
              Popular Restaurants 🔥
            </h3>
            <button className="text-[#FF6B35] font-semibold hover:underline">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-[#FFE5DB] to-[#FFD23F]/30 flex items-center justify-center">
                  <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {restaurant.imageUrl}
                  </div>
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-3 py-1 bg-[#FFE5DB] text-[#FF6B35] text-xs font-semibold rounded-full">
                      {restaurant.cuisine}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                      <span>🕒</span>
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works 🚀
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] rounded-full text-4xl mb-4 shadow-lg">
                📍
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Choose Location</h4>
              <p className="text-gray-600">
                Enter your delivery address and browse restaurants nearby
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#A64AC9] to-[#4ECDC4] rounded-full text-4xl mb-4 shadow-lg">
                🍽️
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pick Your Food</h4>
              <p className="text-gray-600">
                Browse menus and add your favorite dishes to cart
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#4ECDC4] to-[#6BCF7F] rounded-full text-4xl mb-4 shadow-lg">
                🚚
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h4>
              <p className="text-gray-600">
                Get your order delivered hot and fresh to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🍕</div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                  Slooze
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Your favorite food, delivered fast and fresh!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all">
                  📱
                </button>
                <button className="w-10 h-10 bg-gradient-to-br from-[#A64AC9] to-[#4ECDC4] rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all">
                  🐦
                </button>
                <button className="w-10 h-10 bg-gradient-to-br from-[#4ECDC4] to-[#6BCF7F] rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all">
                  📸
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Slooze. All rights reserved. Made with ❤️ and 🍕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
