"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Loader2,
  RefreshCw,
  CreditCard,
  MapPin,
  User,
  UtensilsCrossed,
  DollarSign,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

const GET_ALL_ORDERS = gql`
  query GetAllOrders($status: OrderStatus, $userId: String, $restaurantId: String) {
    orders(status: $status, userId: $userId, restaurantId: $restaurantId) {
      id
      userId
      restaurantId
      status
      totalAmount
      deliveryAddress
      paymentMethodId
      paidAt
      createdAt
      updatedAt
      user {
        id
        name
        email
        country
      }
      restaurant {
        id
        name
        imageUrl
      }
      paymentMethod {
        id
        type
        provider
        last4Digits
      }
      orderItems {
        id
        menuItemId
        quantity
        priceAtOrder
        menuItem {
          id
          name
          description
          imageUrl
          category
        }
      }
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetAvailablePaymentMethods {
    availablePaymentMethods {
      id
      type
      provider
      last4Digits
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      status
    }
  }
`;

const ADMIN_PROCESS_PAYMENT = gql`
  mutation AdminProcessPayment($input: AdminProcessPaymentInput!) {
    adminProcessPayment(input: $input) {
      id
      status
      paidAt
      paymentMethodId
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  priceAtOrder: number;
  menuItem: MenuItem | null;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  country: string;
}

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  last4Digits: string;
}

interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string | null;
  paymentMethodId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserInfo | null;
  restaurant: Restaurant | null;
  paymentMethod: PaymentMethod | null;
  orderItems: OrderItem[];
}

interface OrdersData {
  orders: Order[];
}

interface PaymentMethodsData {
  availablePaymentMethods: PaymentMethod[];
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  DRAFT: <Clock size={14} />,
  PENDING: <Clock size={14} />,
  CONFIRMED: <CheckCircle size={14} />,
  DELIVERED: <Truck size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data, loading, refetch } = useQuery<OrdersData>(GET_ALL_ORDERS, {
    variables: { status: statusFilter || null },
    fetchPolicy: "network-only",
  });

  const { data: paymentMethodsData } = useQuery<PaymentMethodsData>(GET_PAYMENT_METHODS);

  const [updateOrderStatus, { loading: updateLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      toast.success("Order status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [adminProcessPayment, { loading: paymentLoading }] = useMutation(ADMIN_PROCESS_PAYMENT, {
    onCompleted: () => {
      toast.success("Payment processed successfully! Order confirmed.");
      refetch();
      setShowPaymentModal(false);
      setSelectedPaymentMethod("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [cancelOrder, { loading: cancelLoading }] = useMutation(CANCEL_ORDER, {
    onCompleted: () => {
      toast.success("Order cancelled successfully");
      refetch();
      setSelectedOrder(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const orders = data?.orders || [];
  const paymentMethods = paymentMethodsData?.availablePaymentMethods || [];

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.user?.name?.toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query) ||
      order.restaurant?.name?.toLowerCase().includes(query)
    );
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus({
      variables: {
        input: { orderId, status: newStatus },
      },
    });
  };

  const handleProcessPayment = () => {
    if (!selectedOrder || !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    adminProcessPayment({
      variables: {
        input: {
          orderId: selectedOrder.id,
          paymentMethodId: selectedPaymentMethod,
        },
      },
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder({ variables: { orderId } });
    }
  };

  const openPaymentModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedPaymentMethod(order.paymentMethodId || "");
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            View, manage orders, process payments and fulfill deliveries
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <Card
              key={status.value}
              className={clsx(
                "cursor-pointer transition-all hover:shadow-md",
                statusFilter === status.value && "ring-2 ring-primary"
              )}
              onClick={() => setStatusFilter(statusFilter === status.value ? "" : status.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{status.label}</span>
                  {statusIcons[status.value]}
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by customer name, email, or restaurant..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Order Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                              statusColors[order.status]
                            )}
                          >
                            {statusIcons[order.status]}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    {/* Customer & Restaurant Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-muted-foreground" />
                        <div>
                          <p className="font-medium">{order.user?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <UtensilsCrossed size={16} className="text-muted-foreground" />
                        <p className="font-medium">{order.restaurant?.name || "Unknown Restaurant"}</p>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-2 text-sm mb-3">
                        <MapPin size={16} className="text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                    )}

                    {/* Payment Info */}
                    {order.paymentMethod && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <CreditCard size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {order.paymentMethod.provider} •••• {order.paymentMethod.last4Digits}
                        </span>
                        {order.paidAt && (
                          <span className="text-green-600 text-xs">
                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Order Items Preview */}
                    <div className="flex flex-wrap gap-2">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1"
                        >
                          {item.menuItem?.imageUrl && (
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem?.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <span className="text-xs">
                            {item.quantity}× {item.menuItem?.name || "Unknown Item"}
                          </span>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{order.orderItems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 p-4 bg-muted/30 lg:w-48 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:flex-none"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>

                    {(order.status === "DRAFT" || order.status === "PENDING") && !order.paidAt && (
                      <Button
                        size="sm"
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                        onClick={() => openPaymentModal(order)}
                      >
                        <DollarSign size={14} className="mr-1" />
                        Process Payment
                      </Button>
                    )}

                    {order.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                        disabled={updateLoading}
                      >
                        <Truck size={14} className="mr-1" />
                        Mark Delivered
                      </Button>
                    )}

                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelLoading}
                      >
                        <XCircle size={14} className="mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    #{selectedOrder.id}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
                      statusColors[selectedOrder.status]
                    )}
                  >
                    {statusIcons[selectedOrder.status]}
                    {selectedOrder.status}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User size={16} />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.user?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.user?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Country</p>
                      <p className="font-medium">{selectedOrder.user?.country || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">{selectedOrder.deliveryAddress || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <UtensilsCrossed size={16} />
                    Restaurant
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedOrder.restaurant?.imageUrl && (
                      <img
                        src={selectedOrder.restaurant.imageUrl}
                        alt={selectedOrder.restaurant?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <p className="font-medium">{selectedOrder.restaurant?.name || "Unknown"}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard size={16} />
                    Payment Information
                  </h3>
                  {selectedOrder.paymentMethod ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Method</p>
                        <p className="font-medium">
                          {selectedOrder.paymentMethod.provider} •••• {selectedOrder.paymentMethod.last4Digits}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className={clsx("font-medium", selectedOrder.paidAt ? "text-green-600" : "text-yellow-600")}>
                          {selectedOrder.paidAt ? `Paid on ${new Date(selectedOrder.paidAt).toLocaleString()}` : "Pending"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payment method selected</p>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Order Items ({selectedOrder.orderItems.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        {item.menuItem?.imageUrl ? (
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem?.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <UtensilsCrossed size={20} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItem?.name || "Unknown Item"}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.menuItem?.category || "Uncategorized"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.priceAtOrder * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × ${item.priceAtOrder.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedOrder.status !== "CANCELLED" && selectedOrder.status !== "DELIVERED" && (
                  <div className="pt-4 border-t flex flex-wrap gap-2">
                    {(selectedOrder.status === "DRAFT" || selectedOrder.status === "PENDING") && !selectedOrder.paidAt && (
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setShowPaymentModal(true);
                          setSelectedPaymentMethod(selectedOrder.paymentMethodId || "");
                        }}
                      >
                        <DollarSign size={16} className="mr-2" />
                        Process Payment
                      </Button>
                    )}
                    {selectedOrder.status === "PENDING" && (
                      <Button
                        onClick={() => handleStatusChange(selectedOrder.id, "CONFIRMED")}
                        disabled={updateLoading}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Confirm Order
                      </Button>
                    )}
                    {selectedOrder.status === "CONFIRMED" && (
                      <Button
                        onClick={() => handleStatusChange(selectedOrder.id, "DELIVERED")}
                        disabled={updateLoading}
                      >
                        <Truck size={16} className="mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={cancelLoading}
                    >
                      <XCircle size={16} className="mr-2" />
                      Cancel Order
                    </Button>
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t text-xs text-muted-foreground">
                  <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p>Last Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Process Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Process Payment</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod("");
                  }}
                >
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{selectedOrder.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.user?.name} • {selectedOrder.orderItems.length} items
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      ${selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Payment Method</label>
                  <div className="space-y-2">
                    {paymentMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No payment methods available</p>
                    ) : (
                      paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={clsx(
                            "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                            selectedPaymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                            className="w-4 h-4"
                          />
                          <CreditCard size={20} className="text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{method.provider}</p>
                            <p className="text-xs text-muted-foreground">
                              {method.type} •••• {method.last4Digits}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPaymentMethod("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleProcessPayment}
                    disabled={paymentLoading || !selectedPaymentMethod}
                  >
                    {paymentLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                    Confirm Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
