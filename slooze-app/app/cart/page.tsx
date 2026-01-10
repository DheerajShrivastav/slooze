"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
    }
  }
`;

const ADD_ORDER_ITEM = gql`
  mutation AddOrderItem($input: AddOrderItemInput!) {
    addOrderItem(input: $input) {
      id
      menuItemId
      quantity
      priceAtOrder
    }
  }
`;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, restaurantId } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrder] = useMutation(CREATE_ORDER);
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      router.push("/auth/login?redirect=/cart");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!restaurantId) {
        toast.error("Something went wrong. No restaurant detected.");
        return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Creating your order...");

    try {
        // 1. Create the Order
        const { data: orderData } = await createOrder({
            variables: {
                input: {
                    restaurantId: restaurantId,
                    // address: "Default Address" // We might need an address input later
                }
            }
        });

        const orderId = orderData.createOrder.id;
        console.log("Order created:", orderId);

        // 2. Add Items to the Order
        const itemPromises = items.map(item => 
            addOrderItem({
                variables: {
                    input: {
                        orderId: orderId,
                        menuItemId: item.menuItemId,
                        quantity: item.quantity
                    }
                }
            })
        );

        await Promise.all(itemPromises);
        
        // Success
        toast.dismiss(toastId);
        toast.success("Order placed successfully! 🚀");
        clearCart();
        
        // Redirect home or to order confirmation
        router.push("/"); 

    } catch (error: any) {
        toast.dismiss(toastId);
        console.error("Checkout error:", error);
        toast.error(error.message || "Failed to place order");
    } finally {
        setIsProcessing(false);
    }
  };

  const deliveryFee = 2.99;
  const platformFee = 0.99;
  const finalTotal = total + (items.length > 0 ? deliveryFee + platformFee : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12 max-w-4xl">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" /> Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🥗
            </div>
            <h2 className="text-2xl font-bold mb-2">Cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/restaurants">
              <Button size="lg" className="rounded-full px-8">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="md:col-span-2 space-y-6">
               <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                   <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                       <span className="font-semibold text-sm">Items from Restaurant</span>
                       <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                           Clear Cart
                       </Button>
                   </div>
                   <div className="divide-y">
                       {items.map((item) => (
                           <div key={item.menuItemId} className="p-4 flex items-center gap-4">
                               <div className="flex-1">
                                   <h3 className="font-bold">{item.name}</h3>
                                   <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                               </div>
                               
                               <div className="flex items-center gap-3">
                                   <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                                       <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.menuItemId, -1)}>
                                           <Minus size={12} />
                                       </Button>
                                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                       <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.menuItemId, 1)}>
                                           <Plus size={12} />
                                       </Button>
                                   </div>
                                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.menuItemId)}>
                                       <Trash2 size={18} />
                                   </Button>
                               </div>
                               <div className="text-right font-bold w-20">
                                   ${(item.price * item.quantity).toFixed(2)}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
                <Card className="sticky top-24 border-border/60 shadow-lg">
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
                        </div>
                        
                        <div className="border-t pt-4 flex justify-between items-end">
                            <div>
                                <span className="text-sm text-muted-foreground">Total</span>
                                <div className="text-2xl font-black">${finalTotal.toFixed(2)}</div>
                            </div>
                        </div>

                        <Button 
                            className="w-full text-lg h-12 rounded-xl mt-4" 
                            onClick={handleCheckout} 
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                        
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            By placing an order, you agree to our Terms of Service.
                        </p>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
