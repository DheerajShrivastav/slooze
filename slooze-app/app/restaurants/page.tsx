'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Star, Clock, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo, Suspense } from 'react'

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

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  imageUrl: string
}

interface GetRestaurantsResponse {
  restaurants: Restaurant[]
}

function RestaurantsContent() {
  const { data, loading, error } = useQuery<GetRestaurantsResponse>(GET_RESTAURANTS)
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All')

  useEffect(() => {
    setIsClient(true)
    // Read search query from URL params
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  // Get unique cuisines from restaurants
  const cuisines = useMemo(() => {
    if (!data?.restaurants) return ['All']
    const uniqueCuisines = [
      ...new Set(data.restaurants.map((r: Restaurant) => r.cuisine)),
    ]
    return ['All', ...uniqueCuisines.sort()]
  }, [data?.restaurants])

  // Filter restaurants based on search and cuisine
  const filteredRestaurants = useMemo(() => {
    if (!data?.restaurants) return []

    return data.restaurants.filter((restaurant: Restaurant) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCuisine =
        selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine

      return matchesSearch && matchesCuisine
    })
  }, [data?.restaurants, searchQuery, selectedCuisine])

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
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Cuisine Filters */}
          <div className="flex gap-2 flex-wrap">
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? 'primary' : 'outline'}
                className="rounded-full"
                onClick={() => setSelectedCuisine(cuisine)}
                size="sm"
              >
                {cuisine}
              </Button>
            ))}
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
          <>
            {/* Results Count */}
            {searchQuery || selectedCuisine !== 'All' ? (
              <p className="text-sm text-muted-foreground mb-4">
                Found {filteredRestaurants.length} restaurant
                {filteredRestaurants.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCuisine !== 'All' && ` in ${selectedCuisine}`}
              </p>
            ) : null}

            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">No restaurants found</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCuisine('All')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map((restaurant: Restaurant) => (
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    key={restaurant.id}
                    className="block h-full group"
                  >
                    <Card className="border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
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
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <RestaurantsContent />
    </Suspense>
  )
}
