'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      cuisine
      rating
      deliveryTime
      imageUrl
    }
  }
`

export default function RestaurantsPage() {
  const { data, loading, error } = useQuery(GET_RESTAURANTS)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Restaurants Near You
            </h1>
            <p className="text-muted-foreground">
              Discover the best food from top-rated local spots.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">
              All
            </Button>
            <Button variant="ghost" className="rounded-full">
              Fast Food
            </Button>
            <Button variant="ghost" className="rounded-full">
              Healthy
            </Button>
          </div>
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
            <p className="text-muted-foreground mb-6">
              Could not load restaurants.{' '}
              {error.message.includes('Unauthorized')
                ? 'Please sign in to view restaurants.'
                : error.message}
            </p>
            {error.message.includes('Unauthorized') && (
              <Link href="/auth/login">
                <Button size="lg">Sign In</Button>
              </Link>
            )}
          </div>
        )}

        {data?.restaurants && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.restaurants.map((restaurant: any) => (
              <Link
                href={`/restaurants/${restaurant.id}`}
                key={restaurant.id}
                className="block h-full group"
              >
                <Card className="border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="font-bold text-xl drop-shadow-md">
                        {restaurant.name}
                      </h3>
                      <p className="text-xs font-medium opacity-90">
                        {restaurant.cuisine}
                      </p>
                    </div>
                    {restaurant.imageUrl ? (
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        <Star size={12} className="fill-green-700" />
                        {restaurant.rating}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock size={12} />
                        {restaurant.deliveryTime}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                      <span className="text-primary font-bold hover:underline">
                        View Menu
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-full p-0"
                      >
                        <MapPin size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
