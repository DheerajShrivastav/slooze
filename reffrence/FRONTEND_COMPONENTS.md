# Frontend Component Architecture
## Slooze Food Ordering Platform

---

## 📁 Component Structure

### Layout Components

#### Header Component
**Path**: `src/components/layout/Header.tsx`

**Purpose**: Main navigation bar with role-based menu items

**Props**:
```typescript
interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}
```

**Features**:
- Logo/brand
- Navigation links (role-based visibility)
- User profile dropdown
- Cart icon with item count
- Logout button

**Navigation Items**:
```typescript
const navigationItems = {
  ALL_ROLES: ['Home', 'Restaurants', 'My Orders', 'Profile'],
  MANAGER_AND_ADMIN: [],
  ADMIN_ONLY: ['Payment Methods'],
};
```

**Example**:
```tsx
export function Header({ user, onLogout }: HeaderProps) {
  const { cartItemCount } = useCart();
  
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <NavLinks user={user} />
          <div className="flex items-center gap-4">
            <CartIcon count={cartItemCount} />
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </nav>
    </header>
  );
}
```

---

### Authentication Components

#### LoginForm Component
**Path**: `src/components/auth/LoginForm.tsx`

**Features**:
- Email and password inputs
- Form validation with Zod
- Error display
- Loading state
- Redirect after login

**Implementation**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/restaurants');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('email')}
        label="Email"
        type="email"
        error={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="Password"
        type="password"
        error={errors.password?.message}
      />
      <Button type="submit" fullWidth loading={isLoading}>
        Login
      </Button>
    </form>
  );
}
```

---

### Restaurant Components

#### RestaurantCard Component
**Path**: `src/components/restaurant/RestaurantCard.tsx`

**Props**:
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}
```

**Features**:
- Restaurant image
- Country badge
- Name and cuisine
- Rating display
- Delivery time
- Hover effect
- Click handler

**Design**:
```tsx
export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
    >
      <div className="relative h-48">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={restaurant.country === 'INDIA' ? 'orange' : 'blue'}
        >
          {restaurant.country}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
          <span className="text-sm text-gray-500">
            {restaurant.deliveryTime}
          </span>
        </div>
      </div>
    </div>
  );
}
```

#### RestaurantGrid Component
**Path**: `src/components/restaurant/RestaurantGrid.tsx`

**Props**:
```typescript
interface RestaurantGridProps {
  restaurants: Restaurant[];
  loading?: boolean;
}
```

**Features**:
- Responsive grid layout
- Loading skeletons
- Empty state
- Click to view details

---

### Menu Components

#### MenuItemCard Component
**Path**: `src/components/menu/MenuItemCard.tsx`

**Props**:
```typescript
interface MenuItemCardProps {
  menuItem: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}
```

**Features**:
- Item image
- Name, description, price
- Vegetarian indicator
- Add to cart button
- Quantity selector (optional)

**Implementation**:
```tsx
export function MenuItemCard({ menuItem, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="relative h-32 mb-3">
        <Image
          src={menuItem.imageUrl}
          alt={menuItem.name}
          fill
          className="object-cover rounded"
        />
        {menuItem.isVegetarian && (
          <Badge className="absolute top-2 left-2" variant="green">
            🌱 Veg
          </Badge>
        )}
      </div>
      
      <h4 className="font-semibold">{menuItem.name}</h4>
      <p className="text-sm text-gray-600 line-clamp-2">
        {menuItem.description}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-bold">₹{menuItem.price}</span>
        
        <div className="flex items-center gap-2">
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <Button
            size="sm"
            onClick={() => onAddToCart({ ...menuItem, quantity })}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Cart Components

#### CartDrawer Component
**Path**: `src/components/cart/CartDrawer.tsx`

**Props**:
```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- Slide-out from right
- Cart items list
- Total calculation
- Checkout button (role-based)
- Clear cart option

**Role-Based Checkout**:
```tsx
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { user } = useAuth();
  const { cartItems, total, clearCart } = useCart();
  const router = useRouter();

  const canCheckout = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleCheckout = () => {
    if (!canCheckout) return;
    router.push('/orders/checkout');
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right">
      <div className="h-full flex flex-col">
        <DrawerHeader title="Your Cart" onClose={onClose} />
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <CartItemList items={cartItems} />
          )}
        </div>
        
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <Button
            fullWidth
            disabled={!canCheckout || cartItems.length === 0}
            onClick={handleCheckout}
          >
            {canCheckout ? 'Proceed to Checkout' : 'Members Cannot Checkout'}
          </Button>
          
          {!canCheckout && (
            <p className="text-sm text-center text-gray-500">
              Please contact a Manager or Admin to complete your order
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
```

#### CartItem Component
**Path**: `src/components/cart/CartItem.tsx`

**Props**:
```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}
```

**Features**:
- Item details
- Quantity controls
- Remove button
- Price calculation

---

### Order Components

#### OrderCard Component
**Path**: `src/components/order/OrderCard.tsx`

**Props**:
```typescript
interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}
```

**Features**:
- Order ID and date
- Restaurant name
- Order status badge
- Total amount
- Action buttons (role-based)

**Role-Based Actions**:
```tsx
export function OrderCard({ order, onViewDetails, onCancel }: OrderCardProps) {
  const { user } = useAuth();
  const canCancel = 
    (user?.role === 'ADMIN' || user?.role === 'MANAGER') &&
    (order.status === 'DRAFT' || order.status === 'PENDING');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-600">{order.restaurant.name}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        
        <OrderStatusBadge status={order.status} />
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">₹{order.totalAmount.toFixed(2)}</span>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
          >
            View Details
          </Button>
          
          {canCancel && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel?.(order.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Payment Components

#### PaymentMethodForm Component
**Path**: `src/components/payment/PaymentMethodForm.tsx`

**Access**: ADMIN only

**Props**:
```typescript
interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod; // For editing
  onSubmit: (data: PaymentMethodInput) => Promise<void>;
  onCancel: () => void;
}
```

**Features**:
- Payment type selection
- Provider input
- Card number (last 4 digits)
- Expiry date
- Default checkbox
- Validation

---

### UI Components

#### Button Component
**Path**: `src/components/ui/Button.tsx`

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}
```

**Variants**:
- `primary`: Blue background, white text
- `secondary`: Gray background
- `outline`: Border only
- `destructive`: Red for delete/cancel actions

#### Badge Component
**Path**: `src/components/ui/Badge.tsx`

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'blue' | 'green' | 'red';
}
```

**Usage**:
- Country badges (India = orange, America = blue)
- Order status (Draft = gray, Confirmed = green, Cancelled = red)
- Vegetarian indicator (green)

---

## 🎣 Custom Hooks

### useAuth Hook
**Path**: `src/hooks/useAuth.ts`

**Returns**:
```typescript
interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}
```

**Implementation**:
```typescript
export function useAuth() {
  const { user, token } = useContext(AuthContext);
  
  const login = async (email: string, password: string) => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { input: { email, password } },
    });
    
    const { token, user } = data.login;
    localStorage.setItem('token', token);
    setUser(user);
    setToken(token);
  };
  
  // ... other methods
}
```

### useCart Hook
**Path**: `src/hooks/useCart.ts`

**Returns**:
```typescript
interface UseCartReturn {
  cartItems: CartItem[];
  cartItemCount: number;
  total: number;
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
```

### useRole Hook
**Path**: `src/hooks/useRole.ts`

**Returns**:
```typescript
interface UseRoleReturn {
  isAdmin: boolean;
  isManager: boolean;
  isMember: boolean;
  canCheckout: boolean;
  canCancelOrders: boolean;
  canManagePaymentMethods: boolean;
}
```

**Usage**:
```typescript
const { canCheckout, canManagePaymentMethods } = useRole();

// Render checkout button only if allowed
{canCheckout && <Button onClick={handleCheckout}>Checkout</Button>}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Theme

**Colors**:
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        india: {
          500: '#ff9933',  // Saffron/Orange
        },
        america: {
          500: '#1e40af',  // Blue
        },
      },
    },
  },
};
```

### Component Patterns

**Card**: `bg-white rounded-lg shadow-md p-4`
**Container**: `container mx-auto px-4`
**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
**Button Primary**: `bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition`

---

## 🔄 State Management

### Context Providers

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
```

### GraphQL Query Example

```typescript
// src/lib/graphql/queries.ts
export const GET_RESTAURANTS = gql`
  query GetRestaurants($country: Country) {
    restaurants(country: $country) {
      id
      name
      description
      imageUrl
      country
      cuisine
      rating
      deliveryTime
    }
  }
`;

// Usage in component
function RestaurantsPage() {
  const { data, loading, error } = useQuery(GET_RESTAURANTS);
  
  if (loading) return <RestaurantSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <RestaurantGrid restaurants={data.restaurants} />;
}
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Patterns

```tsx
// Mobile-first grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive padding
<div className="px-4 md:px-6 lg:px-8">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Hide on mobile
<div className="hidden md:block">
```

---

## ✅ Component Checklist

### Each Component Should Have:
- [ ] TypeScript types for props
- [ ] Proper error handling
- [ ] Loading states
- [ ] Accessibility attributes (aria-labels, etc.)
- [ ] Responsive design
- [ ] Role-based rendering (if applicable)
- [ ] Unit tests

---

**Document Version**: 1.0  
**Last Updated**: January 2026
