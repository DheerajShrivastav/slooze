'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner' // Assuming we install sonner or use a simple alert for now

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  restaurantId: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, delta: number) => void
  clearCart: () => void
  total: number
  restaurantId: string | null
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  restaurantId: null,
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        setItems(parsed.items || [])
        setRestaurantId(parsed.restaurantId || null)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify({ items, restaurantId }))
    }
  }, [items, restaurantId])

  const addItem = (newItem: CartItem) => {
    // Check if item is from same restaurant
    if (restaurantId && restaurantId !== newItem.restaurantId) {
      if (
        !window.confirm(
          'Start a new basket? Adding items from a different restaurant will clear your current cart.'
        )
      ) {
        return
      }
      setItems([newItem])
      setRestaurantId(newItem.restaurantId)
      return
    }

    // Set restaurant ID if first item
    if (items.length === 0) {
      setRestaurantId(newItem.restaurantId)
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === newItem.menuItemId)
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === newItem.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (menuItemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.menuItemId !== menuItemId)
      if (newItems.length === 0) setRestaurantId(null)
      return newItems
    })
  }

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems((prev) => {
      const newItems = prev
        .map((i) => {
          if (i.menuItemId === menuItemId) {
            return { ...i, quantity: Math.max(0, i.quantity + delta) }
          }
          return i
        })
        .filter((i) => i.quantity > 0)

      if (newItems.length === 0) setRestaurantId(null)
      return newItems
    })
  }

  const clearCart = () => {
    setItems([])
    setRestaurantId(null)
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        restaurantId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
