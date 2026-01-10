"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  Plus, 
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  XCircle,
  CreditCard,
  Wallet
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      userId
      type
      provider
      last4Digits
      expiryMonth
      expiryYear
      isDefault
      createdAt
      updatedAt
    }
  }
`;

const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($input: AddPaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      id
      type
      provider
    }
  }
`;

const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($id: String!, $input: UpdatePaymentMethodInput!) {
    updatePaymentMethod(id: $id, input: $input) {
      id
      type
      provider
    }
  }
`;

const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: String!) {
    deletePaymentMethod(id: $id)
  }
`;

interface PaymentMethod {
  id: string;
  userId: string | null;
  type: string;
  provider: string;
  last4Digits: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethodsData {
  paymentMethods: PaymentMethod[];
}

const paymentTypes = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "UPI", label: "UPI" },
  { value: "WALLET", label: "Wallet" },
];

const paymentTypeIcons: Record<string, React.ReactNode> = {
  CREDIT_CARD: <CreditCard size={20} />,
  DEBIT_CARD: <CreditCard size={20} />,
  UPI: <Wallet size={20} />,
  WALLET: <Wallet size={20} />,
};

interface PaymentMethodForm {
  type: string;
  provider: string;
  last4Digits: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const defaultFormData: PaymentMethodForm = {
  type: "CREDIT_CARD",
  provider: "",
  last4Digits: "",
  expiryMonth: "",
  expiryYear: "",
  isDefault: false,
};

export default function AdminPaymentMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [formData, setFormData] = useState<PaymentMethodForm>(defaultFormData);

  const { data, loading, refetch } = useQuery<PaymentMethodsData>(GET_PAYMENT_METHODS, {
    fetchPolicy: "network-only",
  });

  const [addPaymentMethod, { loading: createLoading }] = useMutation(ADD_PAYMENT_METHOD, {
    onCompleted: () => {
      toast.success("Payment method added successfully");
      refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updatePaymentMethod, { loading: updateLoading }] = useMutation(UPDATE_PAYMENT_METHOD, {
    onCompleted: () => {
      toast.success("Payment method updated successfully");
      refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deletePaymentMethod, { loading: deleteLoading }] = useMutation(DELETE_PAYMENT_METHOD, {
    onCompleted: () => {
      toast.success("Payment method deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const paymentMethods = data?.paymentMethods || [];

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
    setFormData(defaultFormData);
  };

  const openCreateModal = () => {
    setFormData(defaultFormData);
    setEditingMethod(null);
    setIsModalOpen(true);
  };

  const openEditModal = (method: any) => {
    setFormData({
      type: method.type,
      provider: method.provider,
      last4Digits: method.last4Digits,
      expiryMonth: method.expiryMonth.toString(),
      expiryYear: method.expiryYear.toString(),
      isDefault: method.isDefault,
    });
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMethod) {
      updatePaymentMethod({
        variables: {
          id: editingMethod.id,
          input: {
            type: formData.type,
            provider: formData.provider,
            last4Digits: formData.last4Digits,
            expiryMonth: parseInt(formData.expiryMonth),
            expiryYear: parseInt(formData.expiryYear),
            isDefault: formData.isDefault,
          },
        },
      });
    } else {
      addPaymentMethod({
        variables: {
          input: {
            type: formData.type,
            provider: formData.provider,
            last4Digits: formData.last4Digits,
            expiryMonth: parseInt(formData.expiryMonth),
            expiryYear: parseInt(formData.expiryYear),
            isDefault: formData.isDefault,
          },
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deletePaymentMethod({ variables: { id } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage system payment methods and configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Payment Methods Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No payment methods found. Add your first payment method!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method: any) => (
            <Card key={method.id} className={clsx(
              "relative overflow-hidden",
              method.isDefault && "ring-2 ring-primary"
            )}>
              {method.isDefault && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl">
                  Default
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    "p-3 rounded-full",
                    method.type === "CREDIT_CARD" || method.type === "DEBIT_CARD"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  )}>
                    {paymentTypeIcons[method.type]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.provider}</h3>
                    <p className="text-sm text-muted-foreground">
                      {paymentTypes.find(t => t.value === method.type)?.label}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-mono">•••• {method.last4Digits}</span>
                      <span className="text-muted-foreground">
                        {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(method)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3">
                  Added: {new Date(method.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <XCircle size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm mt-1"
                    required
                  >
                    {paymentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Provider / Bank Name</label>
                  <Input
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g., Visa, Mastercard, HDFC Bank"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Last 4 Digits</label>
                  <Input
                    value={formData.last4Digits}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setFormData({ ...formData, last4Digits: value });
                    }}
                    placeholder="1234"
                    maxLength={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Expiry Month</label>
                    <select
                      value={formData.expiryMonth}
                      onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm mt-1"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expiry Year</label>
                    <select
                      value={formData.expiryYear}
                      onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm mt-1"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Set as default payment method</span>
                </label>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={createLoading || updateLoading}>
                    {(createLoading || updateLoading) && (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    )}
                    {editingMethod ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
