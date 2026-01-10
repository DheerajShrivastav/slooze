'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import {
  ArrowLeft,
  Loader2,
  Lock,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useState, useEffect } from 'react'

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
    }
  }
`

const ADD_ORDER_ITEM = gql`
  mutation AddOrderItem($input: AddOrderItemInput!) {
    addOrderItem(input: $input) {
      id
      menuItemId
      quantity
      priceAtOrder
    }
  }
`

interface CreateOrderData {
  createOrder: {
    id: string
    status: string
    totalAmount: number
  }
}

export default function CheckoutPage() {
  const { items, clearCart, total, restaurantId } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [createOrder] = useMutation<CreateOrderData>(CREATE_ORDER)
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const deliveryFee = 2.99
  const platformFee = 0.99
  const tax = total * 0.08
  const finalTotal = total + deliveryFee + platformFee + tax

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!restaurantId) {
      toast.error('Something went wrong. No restaurant detected.')
      return
    }

    setIsProcessing(true)
    const toastId = toast.loading('Placing your order...')

    try {
      // 1. Create the Order
      const { data: orderData } = await createOrder({
        variables: {
          input: {
            restaurantId: restaurantId,
          },
        },
      })

      if (!orderData?.createOrder?.id) {
        throw new Error('Failed to create order')
      }

      const orderId = orderData.createOrder.id

      // 2. Add Items to the Order
      const itemPromises = items.map((item) =>
        addOrderItem({
          variables: {
            input: {
              orderId: orderId,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
            },
          },
        })
      )

      await Promise.all(itemPromises)

      // Success
      toast.dismiss(toastId)
      toast.success('Order placed successfully! 🎉')
      clearCart()

      // Redirect to orders page
      router.push('/orders')
    } catch (error: any) {
      toast.dismiss(toastId)
      console.error('Checkout error:', error)
      toast.error(error.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isClient) return null

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12 max-w-4xl">
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-8">
              Please sign in to proceed with checkout.
            </p>
            <Link href="/auth/login?redirect=/checkout">
              <Button size="lg" className="rounded-full px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12 max-w-4xl">
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checkout.
            </p>
            <Link href="/restaurants">
              <Button size="lg" className="rounded-full px-8">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12 max-w-3xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-extrabold mb-8">Confirm Your Order</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Order Items ({items.length})
              </h2>
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-lg h-fit">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-end">
                <div>
                  <span className="text-sm text-muted-foreground">Total</span>
                  <div className="text-2xl font-black">${finalTotal.toFixed(2)}</div>
                </div>
              </div>

              <Button
                className="w-full text-lg h-12 rounded-xl mt-4"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Place Order
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By placing an order, you agree to our Terms of Service.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
