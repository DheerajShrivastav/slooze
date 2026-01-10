import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star, Clock, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
          <div className="container relative z-10 grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Now delivering to your neighborhood
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Delicious food, <br className="hidden lg:block"/>
                <span className="text-primary italic">delivered swiftly.</span>
              </h1>
              
              <p className="mx-auto lg:mx-0 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Experience the best local restaurants at your fingertips. From sushi to burgers, we handle the craving so you can handle the eating.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    className="h-12 w-full rounded-full border bg-white pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20">
                  Find Food
                </Button>
              </div>
              
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary"></div>
                  No hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary"></div>
                  30-min delivery
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary"></div>
                  Free refund
                </div>
              </div>
            </div>

            {/* Decorative Hero Element - Placeholder for an Image */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
               <div className="relative aspect-square rounded-full bg-gradient-to-tr from-orange-100 to-primary/10 p-8 animate-float">
                  <div className="absolute inset-4 rounded-full bg-white/80 backdrop-blur-3xl shadow-2xl flex items-center justify-center">
                     <span className="text-9xl filter drop-shadow-xl">🍔</span>
                  </div>
                  {/* Floating cards */}
                  <div className="absolute top-10 -right-6 rounded-xl bg-white p-4 shadow-xl shadow-black/5 animate-[float_4s_ease-in-out_infinite_1s]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">🥗</div>
                      <div>
                        <p className="font-bold text-sm">Healthy Choice</p>
                        <p className="text-xs text-muted-foreground">Order received</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-10 -left-6 rounded-xl bg-white p-4 shadow-xl shadow-black/5 animate-[float_5s_ease-in-out_infinite_0.5s]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">🔥</div>
                      <div>
                         <p className="font-bold text-sm">Hot Deals</p>
                         <p className="text-xs text-muted-foreground">-50% off</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 container">
           <div className="flex items-center justify-between mb-10">
             <h2 className="text-3xl font-bold tracking-tight">Browse Categories</h2>
             <Button variant="ghost" className="text-primary hover:text-primary gap-1">
               View All <ArrowRight className="h-4 w-4" />
             </Button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             {[
               { name: "Burgers", icon: "🍔", count: "120+ Options" },
               { name: "Pizza", icon: "🍕", count: "80+ Options" },
               { name: "Asian", icon: "🍜", count: "200+ Options" },
               { name: "Mexican", icon: "🌮", count: "50+ Options" },
               { name: "Dessert", icon: "🍩", count: "90+ Options" },
               { name: "Healthy", icon: "🥗", count: "60+ Options" },
             ].map((cat) => (
               <div key={cat.name} className="group relative overflow-hidden rounded-2xl bg-muted/40 p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-border cursor-pointer text-center">
                 <div className="mb-3 text-5xl transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                 <h3 className="font-bold text-foreground">{cat.name}</h3>
                 <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
               </div>
             ))}
           </div>
        </section>

        {/* Featured Restaurants */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Trending Near You</h2>
              <p className="text-muted-foreground">The most loved restaurants in your city this week. Authentic flavors, top-rated service.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      4.{8 - i}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-7xl">
                       {i === 1 ? "🍱" : i === 2 ? "🥪" : "🍗"}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h3 className="font-bold text-lg leading-tight mb-1">Warning: Delicious Food</h3>
                         <p className="text-sm text-muted-foreground font-medium">Sushi • Japanese • 2987$</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground my-4 font-medium">
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        <Clock size={12} />
                        25-35 min
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">Free Delivery</span>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800">
                      View Menu
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 container">
          <div className="relative rounded-[2.5rem] bg-primary overflow-hidden px-6 py-16 sm:px-16 sm:py-24 text-center sm:text-left">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                Ready to treat your taste buds?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-lg">
                Join thousands of happy foodies and get 50% off your first order with code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">SLOOZE50</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base bg-white text-primary hover:bg-gray-100 border-none">
                  Download App
                </Button>
                <Button size="lg" className="h-14 px-8 text-base bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-none">
                  Become a Partner
                </Button>
              </div>
            </div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-20 translate-y-12 h-96 w-96 rounded-full bg-teal-400/30 blur-3xl"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
