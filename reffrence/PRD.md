# Product Requirements Document (PRD)
## Slooze - Role-Based Food Ordering Platform

---

## 📋 Document Information

| Field | Value |
|-------|-------|
| **Product Name** | Slooze Food Ordering Platform |
| **Version** | 1.0.0 |
| **Document Status** | Draft |
| **Author** | Development Team |
| **Created** | January 2026 |
| **Last Updated** | January 2026 |

---

## 🎯 Executive Summary

Slooze is a full-stack, role-based food ordering web application that enables users with different permission levels (Admin, Manager, Member) to browse restaurants, place orders, and manage payments based on their assigned roles. The platform implements sophisticated access control including Role-Based Access Control (RBAC) and optionally Relationship-Based Access Control (Re-BAC) to restrict operations based on country assignments.

### Vision
To create a secure, scalable, and user-friendly food ordering platform that demonstrates enterprise-grade access control patterns while maintaining an excellent user experience.

### Success Metrics
- **Functional**: 100% role-based permission enforcement
- **Security**: Zero unauthorized access incidents
- **Performance**: Page load times < 2 seconds
- **User Experience**: Intuitive role-appropriate UI
- **Code Quality**: 80%+ test coverage

---

## 🎭 User Roles & Personas

### 1. Admin
**Description**: Full system administrator with complete access  
**Technical Capabilities**: All CRUD operations, system configuration  
**Business Context**: Restaurant chain owner, system administrator  
**Access Level**: Global (can access all countries)

**Key Responsibilities**:
- Manage all payment methods
- Process and cancel any order
- View all restaurants and menu items
- Full checkout capabilities

### 2. Manager
**Description**: Regional or restaurant manager with operational access  
**Technical Capabilities**: Order management, restaurant operations  
**Business Context**: Regional manager, restaurant manager  
**Access Level**: Country-specific restrictions apply

**Key Responsibilities**:
- View restaurants and menu items
- Create and manage orders
- Process checkouts and payments
- Cancel orders

### 3. Member
**Description**: Basic user with limited permissions  
**Technical Capabilities**: Browse and order only  
**Business Context**: Regular customer, limited access user  
**Access Level**: Country-specific restrictions apply

**Key Responsibilities**:
- View restaurants and menu items
- Create orders and add items
- Cannot checkout or pay
- Cannot cancel orders

---

## 🔐 Feature Breakdown & Access Control Matrix

| **Feature** | **Admin** | **Manager** | **Member** | **Priority** |
|-------------|-----------|-------------|------------|--------------|
| **Authentication & Authorization** |
| Register/Login | ✅ | ✅ | ✅ | P0 |
| Role Assignment | ✅ (assign to others) | ❌ | ❌ | P0 |
| Country Assignment | ✅ | ❌ | ❌ | P1 |
| **Restaurant & Menu** |
| View Restaurants | ✅ | ✅ | ✅ | P0 |
| View Menu Items | ✅ | ✅ | ✅ | P0 |
| Filter by Country | ✅ | ✅ | ✅ | P1 |
| Search Restaurants | ✅ | ✅ | ✅ | P2 |
| **Order Management** |
| Create Order | ✅ | ✅ | ✅ | P0 |
| Add Items to Order | ✅ | ✅ | ✅ | P0 |
| Update Order Items | ✅ | ✅ | ✅ | P0 |
| Checkout & Pay | ✅ | ✅ | ❌ | P0 |
| Cancel Order | ✅ | ✅ | ❌ | P0 |
| View Order History | ✅ | ✅ | ✅ | P1 |
| **Payment Methods** |
| Add Payment Method | ✅ | ❌ | ❌ | P0 |
| Modify Payment Method | ✅ | ❌ | ❌ | P0 |
| Delete Payment Method | ✅ | ❌ | ❌ | P0 |
| View Payment Methods | ✅ | ✅ | ✅ | P1 |
| **Country-Based Access (Extension)** |
| Restrict by Country | ✅ | ✅ | ✅ | P1 |
| View Only Assigned Country | N/A (all) | ✅ | ✅ | P1 |

**Priority Legend**:
- **P0**: Critical for MVP
- **P1**: Important for full launch
- **P2**: Nice to have

---

## 🏗️ Technical Architecture

### Technology Stack

#### Backend
- **Framework**: NestJS (Node.js framework)
- **API Layer**: GraphQL with Apollo Server
- **ORM**: Prisma (PostgreSQL recommended)
- **Authentication**: JWT-based authentication
- **Authorization**: Custom RBAC/Re-BAC middleware
- **Validation**: class-validator, class-transformer

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client + React Context
- **GraphQL Client**: Apollo Client
- **Form Handling**: React Hook Form
- **Validation**: Zod

#### Infrastructure
- **Database**: PostgreSQL
- **Caching**: Redis (optional for session management)
- **File Storage**: Local/S3 for restaurant images
- **Hosting**: Vercel (frontend), Railway/Heroku (backend)

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Pages &    │  │  Apollo      │  │  Auth     │ │
│  │  Components  │◄─┤  Client      │◄─┤  Context  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────┬───────────────────────────────┘
                      │ GraphQL over HTTP
                      ▼
┌─────────────────────────────────────────────────────┐
│                   NestJS Backend                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   GraphQL    │  │    Guard/    │  │   Auth    │ │
│  │   Resolvers  │◄─┤  Middleware  │◄─┤  Module   │ │
│  └──────┬───────┘  └──────────────┘  └───────────┘ │
│         │                                            │
│         ▼                                            │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Services   │◄─┤    Prisma    │                │
│  │   (Business  │  │    Client    │                │
│  │    Logic)    │  └──────┬───────┘                │
│  └──────────────┘         │                         │
└────────────────────────────┼─────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

---

## 📊 Data Models

### Core Entities

#### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  name: string
  role: Enum (ADMIN, MANAGER, MEMBER)
  country: Enum (INDIA, AMERICA)
  createdAt: DateTime
  updatedAt: DateTime
  orders: Order[]
  paymentMethods: PaymentMethod[]
}
```

#### Restaurant
```typescript
{
  id: string (UUID)
  name: string
  description: string
  imageUrl: string
  country: Enum (INDIA, AMERICA)
  cuisine: string
  rating: float
  deliveryTime: string
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
  menuItems: MenuItem[]
}
```

#### MenuItem
```typescript
{
  id: string (UUID)
  restaurantId: string (FK)
  name: string
  description: string
  price: decimal
  imageUrl: string
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  createdAt: DateTime
  updatedAt: DateTime
  restaurant: Restaurant
  orderItems: OrderItem[]
}
```

#### Order
```typescript
{
  id: string (UUID)
  userId: string (FK)
  restaurantId: string (FK)
  status: Enum (DRAFT, PENDING, CONFIRMED, DELIVERED, CANCELLED)
  totalAmount: decimal
  deliveryAddress: string
  paymentMethodId: string (FK, nullable)
  paidAt: DateTime (nullable)
  cancelledAt: DateTime (nullable)
  createdAt: DateTime
  updatedAt: DateTime
  user: User
  restaurant: Restaurant
  orderItems: OrderItem[]
  paymentMethod: PaymentMethod
}
```

#### OrderItem
```typescript
{
  id: string (UUID)
  orderId: string (FK)
  menuItemId: string (FK)
  quantity: int
  priceAtOrder: decimal
  createdAt: DateTime
  updatedAt: DateTime
  order: Order
  menuItem: MenuItem
}
```

#### PaymentMethod
```typescript
{
  id: string (UUID)
  userId: string (FK, nullable if global)
  type: Enum (CREDIT_CARD, DEBIT_CARD, UPI, WALLET)
  provider: string (Visa, Mastercard, PayPal, etc.)
  last4Digits: string
  expiryMonth: int
  expiryYear: int
  isDefault: boolean
  createdAt: DateTime
  updatedAt: DateTime
  user: User
  orders: Order[]
}
```

---

## 🔒 Security & Access Control

### Role-Based Access Control (RBAC)

#### Implementation Strategy
1. **GraphQL Directives**: Use custom `@Roles()` decorator
2. **Guards**: NestJS Guards to check user roles
3. **Field-Level Security**: Restrict fields based on roles
4. **Mutation Guards**: Prevent unauthorized mutations

#### Permission Matrix

| **Operation** | **Required Role** | **Additional Checks** |
|---------------|-------------------|----------------------|
| Query: restaurants | ANY | Country filter if Member/Manager |
| Query: menuItems | ANY | Restaurant must be in user's country |
| Mutation: createOrder | ANY | Restaurant must be in user's country |
| Mutation: checkout | ADMIN, MANAGER | Must own the order |
| Mutation: cancelOrder | ADMIN, MANAGER | Must own the order |
| Mutation: addPaymentMethod | ADMIN | N/A |
| Mutation: modifyPaymentMethod | ADMIN | Must own the payment method |

### Relationship-Based Access Control (Re-BAC) - Extension

#### Country-Based Restrictions
- Users assigned to **INDIA** can only:
  - View Indian restaurants
  - Order from Indian restaurants
  - See orders from Indian restaurants
  
- Users assigned to **AMERICA** can only:
  - View American restaurants
  - Order from American restaurants
  - See orders from American restaurants

- **ADMIN** users bypass country restrictions

#### Implementation
```typescript
// GraphQL Resolver Guard Example
@Query(() => [Restaurant])
@UseGuards(JwtAuthGuard, CountryGuard)
async restaurants(@CurrentUser() user: User) {
  if (user.role === Role.ADMIN) {
    return this.restaurantService.findAll();
  }
  return this.restaurantService.findByCountry(user.country);
}
```

---

## 🎨 User Experience Requirements

### Design Principles
1. **Role-Appropriate UI**: Show only relevant actions for each role
2. **Clear Feedback**: Immediate feedback for all actions
3. **Responsive Design**: Mobile-first approach
4. **Accessible**: WCAG 2.1 AA compliance
5. **Performance**: Optimistic updates for better UX

### Key User Flows

#### Flow 1: Member Orders Food (Cannot Checkout)
```
1. Login → 2. Browse Restaurants → 3. View Menu → 
4. Add Items to Order → 5. View Cart → 
6. [BLOCKED] Checkout button disabled with message: 
   "Members cannot checkout. Please contact a Manager or Admin."
```

#### Flow 2: Manager Completes Order
```
1. Login → 2. Browse Restaurants → 3. Add Items → 
4. Review Cart → 5. Select Payment Method → 
6. Checkout → 7. Order Confirmation
```

#### Flow 3: Admin Manages Payment Methods
```
1. Login → 2. Navigate to Payment Settings → 
3. Add New Payment Method → 4. Fill Form → 
5. Save → 6. Confirmation
```

#### Flow 4: Manager Cancels Order
```
1. Login → 2. View Order History → 3. Select Order → 
4. Click Cancel → 5. Confirm Cancellation → 
6. Order Status Updated
```

### UI Components

#### Core Components
- **RestaurantCard**: Display restaurant info with country badge
- **MenuItemCard**: Show menu item with price, image, add-to-cart
- **Cart**: Sidebar/drawer with order summary
- **OrderSummary**: Display order details with role-based actions
- **PaymentMethodForm**: Admin-only form for payment methods
- **RoleBasedButton**: Conditional rendering based on permissions

#### Navigation
```
Navbar (all roles):
- Logo/Home
- Restaurants
- My Orders
- Profile

Additional for Manager/Admin:
- [  ]

Additional for Admin only:
- Payment Methods (Admin Settings)
```

---

## 🧪 Testing Requirements

### Test Coverage Goals
- **Unit Tests**: 80%+ for services and utilities
- **Integration Tests**: 100% for GraphQL resolvers
- **E2E Tests**: Critical user flows (login, order, checkout)
- **Security Tests**: Permission boundaries

### Test Scenarios

#### Authentication & Authorization
- [ ] User can register with valid data
- [ ] User cannot register with duplicate email
- [ ] User can login with correct credentials
- [ ] JWT token is generated and valid
- [ ] Expired tokens are rejected
- [ ] Invalid tokens are rejected

#### Role-Based Access
- [ ] Member cannot access checkout mutation
- [ ] Member cannot access cancel order mutation
- [ ] Member cannot access payment method mutations
- [ ] Manager can checkout orders
- [ ] Manager can cancel orders
- [ ] Manager cannot manage payment methods
- [ ] Admin has full access

#### Country-Based Access (Re-BAC)
- [ ] Indian user sees only Indian restaurants
- [ ] American user sees only American restaurants
- [ ] Admin sees all restaurants regardless of country
- [ ] User cannot order from restaurant in different country
- [ ] Indian user cannot see American orders
- [ ] American user cannot see Indian orders

#### Order Flow
- [ ] User can create an order
- [ ] User can add items to order
- [ ] User can update item quantities
- [ ] User can remove items from order
- [ ] Manager/Admin can complete checkout
- [ ] Order total is calculated correctly
- [ ] Manager/Admin can cancel pending orders
- [ ] Cannot cancel completed orders

#### Payment Methods
- [ ] Admin can add payment method
- [ ] Admin can modify payment method
- [ ] Admin can delete payment method
- [ ] Manager cannot modify payment methods
- [ ] Member cannot modify payment methods
- [ ] Can select payment method during checkout

---

## 📈 Performance Requirements

### Response Time
- **GraphQL Queries**: < 200ms (p95)
- **GraphQL Mutations**: < 500ms (p95)
- **Page Load**: < 2 seconds (initial)
- **Navigation**: < 500ms (client-side)

### Scalability
- **Concurrent Users**: Support 1000+ concurrent users
- **Database**: Indexed queries for common operations
- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Serve static assets via CDN

### Optimization Strategies
- **Database**: Proper indexing on foreign keys, country, role
- **GraphQL**: DataLoader to prevent N+1 queries
- **Frontend**: Code splitting, lazy loading, image optimization
- **API**: Response pagination for large datasets

---

## 🚀 Deployment & DevOps

### Environments
- **Development**: Local development setup
- **Staging**: Pre-production testing
- **Production**: Live application

### CI/CD Pipeline
```
Code Push → Run Tests → Build → Deploy to Staging → 
Manual Approval → Deploy to Production → Health Check
```

### Monitoring & Logging
- **Application Monitoring**: Error tracking (Sentry)
- **Performance Monitoring**: APM tools
- **Logging**: Structured logging with Winston/Pino
- **Alerts**: Set up for critical errors

---

## 📝 Acceptance Criteria

### Minimum Viable Product (MVP)
✅ **Must Have (P0)**:
- [ ] User authentication (register, login, logout)
- [ ] Role assignment (Admin, Manager, Member)
- [ ] Restaurant listing with mock data
- [ ] Menu item display
- [ ] Order creation (all roles)
- [ ] Checkout (Admin, Manager only)
- [ ] Cancel order (Admin, Manager only)
- [ ] Payment method management (Admin only)
- [ ] Role-based UI rendering
- [ ] GraphQL API with all CRUD operations
- [ ] Prisma database integration
- [ ] Basic error handling

🎯 **Should Have (P1)**:
- [ ] Country-based access control
- [ ] Order history
- [ ] Payment method selection
- [ ] Search and filter restaurants
- [ ] Responsive design
- [ ] Loading and error states
- [ ] Form validation
- [ ] Toast notifications

💡 **Nice to Have (P2)**:
- [ ] Restaurant ratings and reviews
- [ ] Order tracking
- [ ] Real-time order updates
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

## 🎓 Learning Objectives

This project demonstrates:
1. **Full-Stack Development**: NestJS + Next.js integration
2. **GraphQL**: Schema design, resolvers, mutations, queries
3. **RBAC**: Role-based permission system
4. **Re-BAC** (Extension): Relationship-based access control
5. **ORM**: Prisma for database management
6. **TypeScript**: End-to-end type safety
7. **Modern React**: Next.js App Router, Server Components
8. **State Management**: Apollo Client integration
9. **Styling**: Tailwind CSS for modern UI
10. **Testing**: Comprehensive test coverage

---

## 📌 Constraints & Assumptions

### Constraints
- Use specified tech stack (NestJS, GraphQL, Prisma, Next.js)
- Implement RBAC for all operations
- Mock restaurant data (no real integrations)
- No real payment processing
- Development project scope (not production-ready)

### Assumptions
- Users are pre-assigned roles by admin
- Single country per user
- No real-time payment gateway integration
- Orders are simplified (no delivery address validation)
- Restaurant data is static (no restaurant management portal)

---

## 🔗 References

### Documentation Links
- NestJS: https://nestjs.com
- GraphQL: https://graphql.org
- Prisma: https://www.prisma.io
- Next.js: https://nextjs.org
- Apollo Client: https://www.apollographql.com/docs/react
- Tailwind CSS: https://tailwindcss.com

### Related Resources
- RBAC Patterns: https://auth0.com/docs/manage-users/access-control/rbac
- GraphQL Security: https://graphql.org/learn/authorization/
- Next.js Authentication: https://nextjs.org/docs/authentication

---

## 📞 Support & Contact

For questions or clarifications:
- **Email**: careers@slooze.xyz
- **Repository**: [GitHub Link]
- **Documentation**: [Notion/Confluence Link]

---

**Document Status**: Draft  
**Next Review Date**: Before development kickoff  
**Approval Required**: Product Owner, Tech Lead
