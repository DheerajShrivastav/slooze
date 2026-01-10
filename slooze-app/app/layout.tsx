import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { ApolloWrapper } from '@/lib/apollo-provider'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from 'sonner'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Slooze - Food Delivery',
  description: 'Your digital candy store for food delivery',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased bg-cream text-onyx`}>
        <ApolloWrapper>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="top-center" richColors />
            </CartProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
