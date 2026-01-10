'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  CreditCard,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clsx } from 'clsx'

const adminNavItems = [
  {
    href: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/admin/orders',
    icon: ShoppingCart,
    label: 'Orders',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/admin/menu-items',
    icon: UtensilsCrossed,
    label: 'Menu Items',
    roles: ['ADMIN'],
  },
  {
    href: '/admin/payment-methods',
    icon: CreditCard,
    label: 'Payment Methods',
    roles: ['ADMIN'],
  },
  { href: '/admin/users', icon: Users, label: 'Users', roles: ['ADMIN'] },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin')
      return
    }

    if (user && user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      router.push('/')
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return null
  }

  const filteredNavItems = adminNavItems.filter((item) =>
    item.roles.includes(user.role)
  )

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xl font-bold">S</span>
              </div>
              <span className="text-lg font-bold">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-primary/10 hover:text-primary',
                'text-muted-foreground'
              )}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t space-y-2">
          <Link
            href="/"
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              'hover:bg-muted text-muted-foreground'
            )}
          >
            <Home size={20} />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button
            onClick={logout}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full',
              'hover:bg-red-50 hover:text-red-600 text-muted-foreground'
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={clsx(
          'flex-1 transition-all duration-300 overflow-auto',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
