'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      createdAt
      status
      totalAmount
      orderItems {
        quantity
      }
    }
  }
`

export default function OrdersPage() {
  const { data, loading, error } = useQuery(GET_MY_ORDERS)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">
          My Orders
        </h1>

        {loading && <p>Loading orders...</p>}

        {error && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your order history.
            </p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}

        {data?.myOrders && data.myOrders.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">No Past Orders</h2>
            <p className="text-muted-foreground mb-6">
              You haven't ordered anything yet. Hungry?
            </p>
            <Link href="/restaurants">
              <Button>Order Now</Button>
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {data?.myOrders?.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-xs font-bold rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} •{' '}
                    {order.orderItems?.length || 0} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.totalAmount}</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Reorder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
