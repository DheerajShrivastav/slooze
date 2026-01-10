'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PartyPopper } from 'lucide-react'
import Link from 'next/link'

export default function OffersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12 text-center">
        <div className="max-w-2xl mx-auto py-20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <PartyPopper className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-black text-foreground mb-4">
            Special Offers
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're cooking up some tasty deals for you. Check back soon for
            discounts, promo codes, and freebies!
          </p>

          <Link href="/restaurants">
            <Button size="lg" className="rounded-full px-8">
              Find Restaurants
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 opacity-50 pointer-events-none grayscale">
          {/* Mock offers */}
          <Card className="overflow-hidden">
            <div className="bg-red-500 h-32 flex items-center justify-center text-white font-bold text-3xl">
              50% OFF
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg">First Order Special</h3>
              <p className="text-muted-foreground">
                Get half off your first delivery.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="bg-orange-500 h-32 flex items-center justify-center text-white font-bold text-3xl">
              FREE DELIVERY
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg">Weekend Vibes</h3>
              <p className="text-muted-foreground">
                Free delivery on all orders over $25.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
