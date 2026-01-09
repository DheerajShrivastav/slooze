"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock menu items data
const menuItems = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    price: 12.99,
    category: "Pizza",
    imageUrl: "🍕",
    isVegetarian: true,
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    description: "Traditional pizza topped with pepperoni and cheese",
    price: 14.99,
    category: "Pizza",
    imageUrl: "🍕",
    isVegetarian: false,
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan and croutons",
    price: 8.99,
    category: "Salads",
    imageUrl: "🥗",
    isVegetarian: true,
  },
  {
    id: "4",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 5.99,
    category: "Sides",
    imageUrl: "🍞",
    isVegetarian: true,
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 6.99,
    category: "Desserts",
    imageUrl: "🍰",
    isVegetarian: true,
  },
  {
    id: "6",
    name: "Italian Soda",
    description: "Refreshing carbonated drink with fruit flavors",
    price: 3.99,
    category: "Drinks",
    imageUrl: "🥤",
    isVegetarian: true,
  },
];

const restaurant = {
  id: "1",
  name: "Pizza Paradise",
  cuisine: "Italian",
  rating: 4.8,
  deliveryTime: "25-35 min",
  imageUrl: "🍕",
  description: "Authentic Italian pizzas with fresh ingredients and traditional recipes",
};

export default function RestaurantPage() {
  // TODO: Use params.id to fetch restaurant data from GraphQL API
  // const params = useParams();
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, count]) => {
      const item = menuItems.find((i) => i.id === itemId);
      return sum + (item?.price || 0) * count;
    }, 0);
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
              ← Back to Restaurants
            </Link>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <section className="bg-gradient-to-br from-[#FFE5DB] via-[#FFF9F0] to-[#FFD23F]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 animate-bounce-in">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="text-8xl">{restaurant.imageUrl}</div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h2>
                <p className="text-lg text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-[#FFE5DB] px-4 py-2 rounded-full">
                    <span className="text-yellow-500 text-xl">⭐</span>
                    <span className="font-bold text-gray-900">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFE5DB] px-4 py-2 rounded-full">
                    <span className="text-xl">🕒</span>
                    <span className="font-bold text-gray-900">{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFE5DB] px-4 py-2 rounded-full">
                    <span className="text-xl">🍽️</span>
                    <span className="font-bold text-gray-900">{restaurant.cuisine}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Menu {selectedCategory && `- ${selectedCategory}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{item.imageUrl}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        {item.isVegetarian && (
                          <span className="text-green-600 text-xl" title="Vegetarian">
                            🌱
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#FF6B35]">
                          ${item.price.toFixed(2)}
                        </span>
                        {cart[item.id] ? (
                          <div className="flex items-center gap-3 bg-[#FFE5DB] rounded-full px-3 py-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 bg-white rounded-full font-bold text-[#FF6B35] hover:shadow-md transition-all"
                            >
                              -
                            </button>
                            <span className="font-bold text-gray-900 w-6 text-center">
                              {cart[item.id]}
                            </span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full font-bold text-white hover:shadow-md transition-all"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item.id)}
                            className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <button className="bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div className="text-left">
              <div className="text-sm opacity-90">{getTotalItems()} items</div>
              <div className="text-lg font-bold">${getTotalPrice().toFixed(2)}</div>
            </div>
            <span className="text-xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
