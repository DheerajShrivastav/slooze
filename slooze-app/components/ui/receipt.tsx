'use client'

import { forwardRef } from 'react'
import { UtensilsCrossed } from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  priceAtOrder: number
  menuItem?: {
    id: string
    name: string
    category?: string
  } | null
}

interface Order {
  id: string
  createdAt: string
  status: string
  totalAmount: number
  deliveryAddress?: string | null
  paidAt?: string | null
  orderItems: OrderItem[]
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
}

interface ReceiptProps {
  order: Order
  showLogo?: boolean
  taxRate?: number
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ order, showLogo = true, taxRate = 0.08 }, ref) => {
    const subtotal = order.orderItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    )
    const tax = subtotal * taxRate
    const total = order.totalAmount

    return (
      <div
        ref={ref}
        className="bg-white text-black p-8 max-w-sm mx-auto font-mono text-sm"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo */}
        {showLogo && (
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-center">
              SLOOZE
            </h1>
            <p className="text-xs text-gray-600 mt-1">Food Delivery</p>
          </div>
        )}

        {/* Restaurant Details */}
        <div className="text-center mb-6 text-xs">
          <h2 className="font-bold text-lg mb-1">
            {order.restaurant?.name || 'Restaurant'}
          </h2>
          {order.restaurant?.cuisine && (
            <p className="text-gray-600">{order.restaurant.cuisine} Cuisine</p>
          )}
          {order.deliveryAddress && (
            <p className="text-gray-600 mt-1">
              Delivered to: {order.deliveryAddress}
            </p>
          )}
          <p className="text-gray-600 mt-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Dashed line separator */}
        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Order Items */}
        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start gap-2"
            >
              <div className="flex-1">
                <span>
                  {item.menuItem?.name || 'Item'}
                  {item.quantity > 1 && (
                    <span className="text-gray-500"> (x{item.quantity})</span>
                  )}
                </span>
              </div>
              <span className="text-right whitespace-nowrap">
                ${(item.priceAtOrder * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Dashed line separator */}
        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Totals */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Dashed line separator */}
        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Payment Info */}
        {order.paymentMethod && (
          <div className="text-center text-xs text-gray-600 mb-4">
            <p>
              Paid with {order.paymentMethod.provider} ••••{' '}
              {order.paymentMethod.last4Digits}
            </p>
            {order.paidAt && (
              <p className="mt-1">
                {new Date(order.paidAt).toLocaleDateString()}{' '}
                {new Date(order.paidAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {/* Customer Info */}
        {order.user && (
          <div className="text-center text-xs text-gray-600 mb-4">
            <p>Customer: {order.user.name}</p>
            <p>{order.user.email}</p>
          </div>
        )}

        {/* Order Date */}
        <div className="text-center text-xs text-gray-500 mb-4">
          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>

        {/* Thank you message */}
        <div className="text-center mt-6">
          <p className="font-bold">Thank you for your order!</p>
          <p className="text-xs text-gray-600 mt-1">
            Enjoy your meal from Slooze
          </p>
        </div>

        {/* Status Badge */}
        <div className="mt-4 text-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
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
      </div>
    )
  }
)

Receipt.displayName = 'Receipt'

export { Receipt }
export type { Order as ReceiptOrder, OrderItem as ReceiptOrderItem }
