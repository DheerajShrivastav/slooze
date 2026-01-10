'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReceiptModal } from '@/components/ui/receipt-modal'
import { ShoppingBag, FileText, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      createdAt
      status
      totalAmount
      deliveryAddress
      paidAt
      user {
        id
        name
        email
        country
      }
      restaurant {
        id
        name
        description
        cuisine
      }
      paymentMethod {
        id
        type
        provider
        last4Digits
      }
      orderItems {
        id
        quantity
        priceAtOrder
        menuItem {
          id
          name
          category
        }
      }
    }
  }
`

interface Order {
  id: string
  createdAt: string
  status: string
  totalAmount: number
  deliveryAddress?: string | null
  paidAt?: string | null
  user?: {
    id: string
    name: string
    email: string
    country?: string
  } | null
  restaurant?: {
    id: string
    name: string
    description?: string
    cuisine?: string
  } | null
  paymentMethod?: {
    id: string
    type: string
    provider: string
    last4Digits: string
  } | null
  orderItems: {
    id: string
    quantity: number
    priceAtOrder: number
    menuItem?: {
      id: string
      name: string
      category?: string
    } | null
  }[]
}

interface GetMyOrdersResponse {
  myOrders: Order[]
}

export default function OrdersPage() {
  const { data, loading, error } = useQuery<GetMyOrdersResponse>(GET_MY_ORDERS)
  const [isClient, setIsClient] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order)
    setShowReceipt(true)
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    setSelectedOrder(null)
  }

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
          {data?.myOrders?.map((order: Order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : order.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} •{' '}
                    {order.orderItems?.length || 0} items
                    {order.restaurant?.name && ` • ${order.restaurant.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleViewReceipt(order)}
                    >
                      <FileText size={14} className="mr-1" />
                      Receipt
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <RotateCcw size={14} className="mr-1" />
                      Reorder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />

      {/* Receipt Modal */}
      {selectedOrder && (
        <ReceiptModal
          order={selectedOrder}
          isOpen={showReceipt}
          onClose={handleCloseReceipt}
        />
      )}
    </div>
  )
}
