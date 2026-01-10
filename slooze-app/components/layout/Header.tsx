'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag,
  Search,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'
import { clsx } from 'clsx'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(
        `/restaurants?search=${encodeURIComponent(searchQuery.trim())}`
      )
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Slooze
            </span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/restaurants"
              className="hover:text-primary transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/offers"
              className="hover:text-primary transition-colors"
            >
              Offers
            </Link>
            {isAuthenticated && (
              <Link
                href="/orders"
                className="hover:text-primary transition-colors"
              >
                My Orders
              </Link>
            )}
            {isAdminOrManager && (
              <Link
                href="/admin"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border focus-within:ring-1 ring-primary transition-all"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground text-foreground"
            />
          </form>

          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user?.name?.[0] || <User size={16} />}
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="hidden md:flex font-semibold">
                Sign In
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <Link
            href="/restaurants"
            className="block text-sm font-medium hover:text-primary"
          >
            Restaurants
          </Link>
          <Link
            href="/offers"
            className="block text-sm font-medium hover:text-primary"
          >
            Offers
          </Link>
          {isAuthenticated && (
            <Link
              href="/orders"
              className="block text-sm font-medium hover:text-primary"
            >
              My Orders
            </Link>
          )}
          {isAdminOrManager && (
            <Link
              href="/admin"
              className="block text-sm font-medium hover:text-primary flex items-center gap-1"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          )}
          {!isAuthenticated && (
            <Link href="/auth/login">
              <Button className="w-full mt-2">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
