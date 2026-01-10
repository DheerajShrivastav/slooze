'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Clock, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

const GET_RESTAURANT_DETAILS = gql`
  query GetRestaurantDetails($id: String!, $restaurantId: String!) {
    restaurant(id: $id) {
      id
      name
      description
      rating
      deliveryTime
      cuisine
      imageUrl
    }
    menuItems(restaurantId: $restaurantId) {
      id
      name
      description
      price
      category
      imageUrl
      isVegetarian
    }
  }
`

interface Restaurant {
  id: string
  name: string
  description?: string
  rating?: number
  deliveryTime?: string
  cuisine?: string
  imageUrl?: string
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  imageUrl?: string
  isVegetarian?: boolean
}

interface GetRestaurantDetailsResponse {
  restaurant: Restaurant
  menuItems: MenuItem[]
}

interface GetRestaurantDetailsVariables {
  id: string
  restaurantId: string
}

export default function RestaurantDetailsPage() {
  const { id } = useParams()
  const restaurantIdStr = Array.isArray(id) ? id[0] : id ?? ''

  const { data, loading, error } = useQuery<
    GetRestaurantDetailsResponse,
    GetRestaurantDetailsVariables
  >(GET_RESTAURANT_DETAILS, {
    variables: { id: restaurantIdStr, restaurantId: restaurantIdStr },
    skip: !restaurantIdStr,
  })

  const {
    addItem,
    items,
    updateQuantity,
    restaurantId: cartRestaurantId,
  } = useCart()

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
        <Footer />
      </div>
    )

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container py-20 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Unable to load menu
          </h2>
          <p className="text-muted-foreground mb-6">
            {error.message.includes('Unauthorized')
              ? "Please sign in to view this restaurant's menu."
              : error.message}
          </p>
          {error.message.includes('Unauthorized') ? (
            <Link href="/auth/login">
              <Button size="lg">Sign In</Button>
            </Link>
          ) : (
            <Link href="/restaurants">
              <Button variant="outline">Back to Restaurants</Button>
            </Link>
          )}
        </div>
        <Footer />
      </div>
    )
  }

  const { restaurant, menuItems } = data || {}

  const categories = menuItems?.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const handleAddToCart = (item: any) => {
    if (!restaurant) return
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: restaurant.id,
    })
    toast.success(`Added ${item.name} to cart`)
  }

  const getItemQuantity = (itemId: string) => {
    const item = items.find((i) => i.menuItemId === itemId)
    return item ? item.quantity : 0
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Header />

      <div className="border-b sticky top-16 z-30 shadow-sm backdrop-blur-md bg-white/90 supports-backdrop-filter:bg-white/60">
        <div className="container py-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-4xl overflow-hidden shadow-inner">
              {restaurant?.imageUrl ? (
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                '🍽️'
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground">
                {restaurant?.name}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {restaurant?.cuisine} • {restaurant?.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                  <Star size={14} className="fill-green-700" />{' '}
                  {restaurant?.rating}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  <Clock size={14} /> {restaurant?.deliveryTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-8 flex-1 grid md:grid-cols-4 gap-8">
        <div className="hidden md:block col-span-1">
          <div className="sticky top-44 space-y-1">
            <h3 className="font-bold text-lg mb-4 px-2">Menu</h3>
            {categories &&
              Object.keys(categories).map((cat) => (
                <a
                  key={cat}
                  href={`#${cat}`}
                  className="block px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent hover:border-primary"
                >
                  {cat}
                </a>
              ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 space-y-10">
          {categories &&
            Object.entries(categories).map(
              ([category, items]: [string, any]) => (
                <section key={category} id={category} className="scroll-mt-44">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 pb-2 border-b">
                    {category}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({items.length})
                    </span>
                  </h2>

                  <div className="grid gap-6">
                    {items.map((item: any) => (
                      <Card
                        key={item.id}
                        className="flex flex-col sm:flex-row overflow-hidden border-border/40 hover:border-border transition-colors group"
                      >
                        <div className="h-40 sm:w-40 sm:h-auto bg-gray-50 relative shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl grayscale opacity-50">
                              🥘
                            </span>
                          )}
                          {item.isVegetarian && (
                            <div className="absolute top-2 left-2 w-5 h-5 rounded-sm border border-green-600 flex items-center justify-center bg-white p-0.5 shadow-sm">
                              <div className="w-full h-full rounded-full bg-green-600"></div>
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              <span className="font-bold text-foreground bg-muted/50 px-2 py-1 rounded text-sm">
                                ${item.price}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            {getItemQuantity(item.id) > 0 ? (
                              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-2 py-1 shadow-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-md hover:bg-white hover:text-destructive"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="font-bold text-sm w-4 text-center">
                                  {getItemQuantity(item.id)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-md hover:bg-white hover:text-primary"
                                  onClick={() =>
                                    item && updateQuantity(item.id, 1)
                                  }
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="rounded-lg px-6 font-semibold shadow-sm"
                                onClick={() => handleAddToCart(item)}
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
