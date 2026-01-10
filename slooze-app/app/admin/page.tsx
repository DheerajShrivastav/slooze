"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { 
  ShoppingCart, 
  UtensilsCrossed, 
  CreditCard, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    orders(status: null) {
      id
      status
      totalAmount
      createdAt
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      role
    }
  }
`;

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface User {
  id: string;
  role: string;
}

interface OrdersData {
  orders: Order[];
}

interface UsersData {
  users: User[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { data: ordersData, loading: ordersLoading } = useQuery<OrdersData>(GET_DASHBOARD_STATS);
  const { data: usersData, loading: usersLoading } = useQuery<UsersData>(GET_ALL_USERS, {
    skip: !isAdmin,
  });

  const orders = ordersData?.orders || [];
  const users = usersData?.users || [];

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length;
  const confirmedOrders = orders.filter((o: any) => o.status === "CONFIRMED").length;
  const deliveredOrders = orders.filter((o: any) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o: any) => o.status === "CANCELLED").length;
  const totalRevenue = orders
    .filter((o: any) => o.status === "DELIVERED")
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  const totalUsers = users.length;
  const adminUsers = users.filter((u: any) => u.role === "ADMIN").length;
  const managerUsers = users.filter((u: any) => u.role === "MANAGER").length;
  const memberUsers = users.filter((u: any) => u.role === "MEMBER").length;

  const recentOrders = [...orders]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      href: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      href: "/admin/orders?status=PENDING",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: CheckCircle,
      color: "bg-green-500",
      href: "/admin/orders?status=DELIVERED",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-primary",
      href: "/admin/orders",
    },
  ];

  const adminStatCards = isAdmin
    ? [
        {
          title: "Total Users",
          value: totalUsers,
          icon: Users,
          color: "bg-purple-500",
          href: "/admin/users",
        },
        {
          title: "Members",
          value: memberUsers,
          icon: Users,
          color: "bg-indigo-500",
          href: "/admin/users?role=MEMBER",
        },
      ]
    : [];

  if (ordersLoading || (isAdmin && usersLoading)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Admin-only stats */}
      {isAdmin && adminStatCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStatCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Pending</span>
                </div>
                <span className="font-semibold">{pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Confirmed</span>
                </div>
                <span className="font-semibold">{confirmedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Delivered</span>
                </div>
                <span className="font-semibold">{deliveredOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Cancelled</span>
                </div>
                <span className="font-semibold">{cancelledOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/orders"
              className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Manage Orders</span>
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/menu-items"
                  className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium">Menu Items</span>
                </Link>
                <Link
                  href="/admin/payment-methods"
                  className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <CreditCard className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium">Payment Methods</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <Users className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium">Manage Users</span>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
