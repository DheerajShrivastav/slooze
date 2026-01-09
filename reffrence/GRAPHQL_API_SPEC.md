# GraphQL API Specification
## Slooze Food Ordering Platform

---

## 📋 Overview

This document defines the complete GraphQL API schema for the Slooze food ordering platform. The API implements role-based access control (RBAC) and country-based restrictions (Re-BAC).

---

## 🔐 Authentication

All requests (except `register` and `login`) require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📝 GraphQL Schema

### Enums

```graphql
enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum Country {
  INDIA
  AMERICA
}

enum OrderStatus {
  DRAFT
  PENDING
  CONFIRMED
  DELIVERED
  CANCELLED
}

enum PaymentMethodType {
  CREDIT_CARD
  DEBIT_CARD
  UPI
  WALLET
}
```

---

### Types

#### User

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  role: Role!
  country: Country!
  createdAt: DateTime!
  updatedAt: DateTime!
  orders: [Order!]! @auth(requires: SELF_OR_ADMIN)
  paymentMethods: [PaymentMethod!]! @auth(requires: ADMIN)
}
```

**Access Control**:
- All users can query their own user data
- Only ADMIN can query other users' full data
- `orders` field: only the user or ADMIN can see
- `paymentMethods` field: only ADMIN can see

#### Restaurant

```graphql
type Restaurant {
  id: ID!
  name: String!
  description: String!
  imageUrl: String!
  country: Country!
  cuisine: String!
  rating: Float!
  deliveryTime: String!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  menuItems: [MenuItem!]!
  orders: [Order!]! @auth(requires: ADMIN)
}
```

**Access Control**:
- All authenticated users can view restaurant data
- Country filtering applied for MANAGER/MEMBER
- `orders` field: only ADMIN can see

#### MenuItem

```graphql
type MenuItem {
  id: ID!
  restaurantId: ID!
  name: String!
  description: String!
  price: Float!
  imageUrl: String!
  category: String!
  isAvailable: Boolean!
  isVegetarian: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  restaurant: Restaurant!
}
```

**Access Control**:
- All authenticated users can view menu items
- Country filtering applied via restaurant relationship

#### Order

```graphql
type Order {
  id: ID!
  userId: ID!
  restaurantId: ID!
  status: OrderStatus!
  totalAmount: Float!
  deliveryAddress: String
  paymentMethodId: ID
  paidAt: DateTime
  cancelledAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
  restaurant: Restaurant!
  orderItems: [OrderItem!]!
  paymentMethod: PaymentMethod
}
```

**Access Control**:
- Users can only query their own orders
- ADMIN can query all orders
- Country filtering applied (orders must be from restaurants in user's country)

#### OrderItem

```graphql
type OrderItem {
  id: ID!
  orderId: ID!
  menuItemId: ID!
  quantity: Int!
  priceAtOrder: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
  order: Order!
  menuItem: MenuItem!
}
```

**Access Control**:
- Same as parent Order

#### PaymentMethod

```graphql
type PaymentMethod {
  id: ID!
  userId: ID
  type: PaymentMethodType!
  provider: String!
  last4Digits: String!
  expiryMonth: Int!
  expiryYear: Int!
  isDefault: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User
}
```

**Access Control**:
- Only ADMIN can query payment methods
- Only ADMIN can create/modify/delete payment methods

---

### Queries

#### Authentication & Users

```graphql
type Query {
  """
  Get current authenticated user
  Requires: Any authenticated user
  """
  me: User!
  
  """
  Get user by ID
  Requires: ADMIN only
  """
  user(id: ID!): User @auth(requires: ADMIN)
  
  """
  Get all users
  Requires: ADMIN only
  """
  users(
    role: Role
    country: Country
  ): [User!]! @auth(requires: ADMIN)
}
```

#### Restaurants & Menu

```graphql
type Query {
  """
  Get all restaurants
  Requires: Any authenticated user
  Filters: By user's country (except ADMIN)
  """
  restaurants(
    country: Country  # Optional for ADMIN
    cuisine: String
    isActive: Boolean = true
  ): [Restaurant!]!
  
  """
  Get single restaurant by ID
  Requires: Any authenticated user
  Validation: Restaurant must be in user's country (except ADMIN)
  """
  restaurant(id: ID!): Restaurant
  
  """
  Get menu items for a restaurant
  Requires: Any authenticated user
  Validation: Restaurant must be in user's country (except ADMIN)
  """
  menuItems(
    restaurantId: ID!
    category: String
    isAvailable: Boolean = true
    isVegetarian: Boolean
  ): [MenuItem!]!
  
  """
  Get single menu item by ID
  Requires: Any authenticated user
  """
  menuItem(id: ID!): MenuItem
}
```

#### Orders

```graphql
type Query {
  """
  Get user's order history
  Requires: Any authenticated user
  Filters: User's own orders only (except ADMIN)
  """
  myOrders(
    status: OrderStatus
    limit: Int = 10
    offset: Int = 0
  ): [Order!]!
  
  """
  Get single order by ID
  Requires: Any authenticated user
  Validation: Must be user's order (except ADMIN)
  """
  order(id: ID!): Order
  
  """
  Get all orders (ADMIN only)
  Requires: ADMIN
  """
  orders(
    userId: ID
    restaurantId: ID
    status: OrderStatus
    country: Country
  ): [Order!]! @auth(requires: ADMIN)
}
```

#### Payment Methods

```graphql
type Query {
  """
  Get all payment methods
  Requires: ADMIN only
  """
  paymentMethods: [PaymentMethod!]! @auth(requires: ADMIN)
  
  """
  Get available payment methods for checkout
  Requires: MANAGER or ADMIN
  Returns: Active payment methods
  """
  availablePaymentMethods: [PaymentMethod!]! @auth(requires: [ADMIN, MANAGER])
}
```

---

### Mutations

#### Authentication

```graphql
type Mutation {
  """
  Register new user (default role: MEMBER)
  Requires: No authentication
  """
  register(input: RegisterInput!): AuthPayload!
  
  """
  Login with email and password
  Requires: No authentication
  """
  login(input: LoginInput!): AuthPayload!
}

input RegisterInput {
  email: String!
  password: String!
  name: String!
  country: Country!
}

input LoginInput {
  email: String!
  password: String!
}

type AuthPayload {
  token: String!
  user: User!
}
```

#### User Management

```graphql
type Mutation {
  """
  Update user role (ADMIN only)
  Requires: ADMIN
  """
  updateUserRole(
    userId: ID!
    role: Role!
  ): User! @auth(requires: ADMIN)
  
  """
  Update user country (ADMIN only)
  Requires: ADMIN
  """
  updateUserCountry(
    userId: ID!
    country: Country!
  ): User! @auth(requires: ADMIN)
}
```

#### Orders

```graphql
type Mutation {
  """
  Create new order
  Requires: Any authenticated user
  Validation: Restaurant must be in user's country (except ADMIN)
  """
  createOrder(input: CreateOrderInput!): Order!
  
  """
  Add item to order
  Requires: Any authenticated user
  Validation: Must be order owner, order status must be DRAFT
  """
  addOrderItem(input: AddOrderItemInput!): OrderItem!
  
  """
  Update order item quantity
  Requires: Any authenticated user
  Validation: Must be order owner, order status must be DRAFT
  """
  updateOrderItem(input: UpdateOrderItemInput!): OrderItem!
  
  """
  Remove item from order
  Requires: Any authenticated user
  Validation: Must be order owner, order status must be DRAFT
  """
  removeOrderItem(id: ID!): Boolean!
  
  """
  Checkout and pay for order
  Requires: ADMIN or MANAGER
  Validation: Must be order owner, order status must be DRAFT
  """
  checkout(input: CheckoutInput!): Order! @auth(requires: [ADMIN, MANAGER])
  
  """
  Cancel order
  Requires: ADMIN or MANAGER
  Validation: Must be order owner, order cannot be CONFIRMED or DELIVERED
  """
  cancelOrder(orderId: ID!): Order! @auth(requires: [ADMIN, MANAGER])
}

input CreateOrderInput {
  restaurantId: ID!
  deliveryAddress: String
}

input AddOrderItemInput {
  orderId: ID!
  menuItemId: ID!
  quantity: Int!
}

input UpdateOrderItemInput {
  orderItemId: ID!
  quantity: Int!
}

input CheckoutInput {
  orderId: ID!
  paymentMethodId: ID!
  deliveryAddress: String
}
```

#### Payment Methods

```graphql
type Mutation {
  """
  Add new payment method
  Requires: ADMIN only
  """
  addPaymentMethod(input: AddPaymentMethodInput!): PaymentMethod! @auth(requires: ADMIN)
  
  """
  Update payment method
  Requires: ADMIN only
  """
  updatePaymentMethod(
    id: ID!
    input: UpdatePaymentMethodInput!
  ): PaymentMethod! @auth(requires: ADMIN)
  
  """
  Delete payment method
  Requires: ADMIN only
  Validation: Cannot delete payment method used in active orders
  """
  deletePaymentMethod(id: ID!): Boolean! @auth(requires: ADMIN)
}

input AddPaymentMethodInput {
  type: PaymentMethodType!
  provider: String!
  last4Digits: String!
  expiryMonth: Int!
  expiryYear: Int!
  isDefault: Boolean
}

input UpdatePaymentMethodInput {
  type: PaymentMethodType
  provider: String
  last4Digits: String
  expiryMonth: Int
  expiryYear: Int
  isDefault: Boolean
}
```

---

## 🔒 Authorization Rules

### Custom GraphQL Directives

#### @auth Directive

```graphql
directive @auth(requires: [Role!]) on FIELD_DEFINITION | OBJECT
```

**Usage**:
```graphql
type Mutation {
  checkout(input: CheckoutInput!): Order! @auth(requires: [ADMIN, MANAGER])
}
```

**Implementation** (NestJS Guard):
```typescript
@Injectable()
export class AuthDirective implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = context.getHandler().getMetadata('roles');
    const user = GqlExecutionContext.create(context).getContext().req.user;
    return requiredRoles.includes(user.role);
  }
}
```

---

## 📊 Example Requests & Responses

### 1. Register New User

**Request**:
```graphql
mutation RegisterUser {
  register(input: {
    email: "john@example.com"
    password: "SecurePassword123!"
    name: "John Doe"
    country: INDIA
  }) {
    token
    user {
      id
      email
      name
      role
      country
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user-uuid-123",
        "email": "john@example.com",
        "name": "John Doe",
        "role": "MEMBER",
        "country": "INDIA"
      }
    }
  }
}
```

---

### 2. Login

**Request**:
```graphql
mutation Login {
  login(input: {
    email: "john@example.com"
    password: "SecurePassword123!"
  }) {
    token
    user {
      id
      email
      role
      country
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user-uuid-123",
        "email": "john@example.com",
        "role": "MEMBER",
        "country": "INDIA"
      }
    }
  }
}
```

---

### 3. Get Restaurants (MEMBER - India)

**Request**:
```graphql
query GetRestaurants {
  restaurants {
    id
    name
    country
    cuisine
    rating
    deliveryTime
    imageUrl
  }
}
```

**Response** (only Indian restaurants):
```json
{
  "data": {
    "restaurants": [
      {
        "id": "restaurant-1",
        "name": "Tandoori Delights",
        "country": "INDIA",
        "cuisine": "North Indian",
        "rating": 4.5,
        "deliveryTime": "30-40 min",
        "imageUrl": "https://example.com/tandoori.jpg"
      },
      {
        "id": "restaurant-2",
        "name": "Dosa Palace",
        "country": "INDIA",
        "cuisine": "South Indian",
        "rating": 4.7,
        "deliveryTime": "25-35 min",
        "imageUrl": "https://example.com/dosa.jpg"
      }
    ]
  }
}
```

---

### 4. Get Menu Items

**Request**:
```graphql
query GetMenuItems {
  menuItems(restaurantId: "restaurant-1") {
    id
    name
    description
    price
    category
    isVegetarian
    imageUrl
  }
}
```

**Response**:
```json
{
  "data": {
    "menuItems": [
      {
        "id": "item-1",
        "name": "Butter Chicken",
        "description": "Creamy tomato-based chicken curry",
        "price": 299.00,
        "category": "Main Course",
        "isVegetarian": false,
        "imageUrl": "https://example.com/butter-chicken.jpg"
      },
      {
        "id": "item-2",
        "name": "Paneer Tikka",
        "description": "Grilled cottage cheese with spices",
        "price": 249.00,
        "category": "Appetizer",
        "isVegetarian": true,
        "imageUrl": "https://example.com/paneer-tikka.jpg"
      }
    ]
  }
}
```

---

### 5. Create Order (Any Role)

**Request**:
```graphql
mutation CreateOrder {
  createOrder(input: {
    restaurantId: "restaurant-1"
    deliveryAddress: "123 Main St, Mumbai"
  }) {
    id
    status
    totalAmount
    restaurant {
      name
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "createOrder": {
      "id": "order-uuid-456",
      "status": "DRAFT",
      "totalAmount": 0,
      "restaurant": {
        "name": "Tandoori Delights"
      }
    }
  }
}
```

---

### 6. Add Item to Order (Any Role)

**Request**:
```graphql
mutation AddItemToOrder {
  addOrderItem(input: {
    orderId: "order-uuid-456"
    menuItemId: "item-1"
    quantity: 2
  }) {
    id
    quantity
    priceAtOrder
    menuItem {
      name
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "addOrderItem": {
      "id": "order-item-789",
      "quantity": 2,
      "priceAtOrder": 299.00,
      "menuItem": {
        "name": "Butter Chicken"
      }
    }
  }
}
```

---

### 7. Checkout (MANAGER/ADMIN Only)

**Request**:
```graphql
mutation CheckoutOrder {
  checkout(input: {
    orderId: "order-uuid-456"
    paymentMethodId: "payment-method-123"
  }) {
    id
    status
    totalAmount
    paidAt
    paymentMethod {
      type
      last4Digits
    }
  }
}
```

**Response** (Success for MANAGER/ADMIN):
```json
{
  "data": {
    "checkout": {
      "id": "order-uuid-456",
      "status": "PENDING",
      "totalAmount": 598.00,
      "paidAt": "2026-01-08T14:00:00Z",
      "paymentMethod": {
        "type": "CREDIT_CARD",
        "last4Digits": "4242"
      }
    }
  }
}
```

**Response** (Error for MEMBER):
```json
{
  "errors": [
    {
      "message": "Forbidden: User role MEMBER does not have permission",
      "extensions": {
        "code": "FORBIDDEN",
        "requiredRoles": ["ADMIN", "MANAGER"]
      }
    }
  ]
}
```

---

### 8. Cancel Order (MANAGER/ADMIN Only)

**Request**:
```graphql
mutation CancelOrder {
  cancelOrder(orderId: "order-uuid-456") {
    id
    status
    cancelledAt
  }
}
```

**Response**:
```json
{
  "data": {
    "cancelOrder": {
      "id": "order-uuid-456",
      "status": "CANCELLED",
      "cancelledAt": "2026-01-08T14:05:00Z"
    }
  }
}
```

---

### 9. Add Payment Method (ADMIN Only)

**Request**:
```graphql
mutation AddPaymentMethod {
  addPaymentMethod(input: {
    type: CREDIT_CARD
    provider: "Visa"
    last4Digits: "1234"
    expiryMonth: 12
    expiryYear: 2026
    isDefault: true
  }) {
    id
    type
    provider
    last4Digits
  }
}
```

**Response** (Success for ADMIN):
```json
{
  "data": {
    "addPaymentMethod": {
      "id": "payment-method-456",
      "type": "CREDIT_CARD",
      "provider": "Visa",
      "last4Digits": "1234"
    }
  }
}
```

**Response** (Error for MANAGER/MEMBER):
```json
{
  "errors": [
    {
      "message": "Forbidden: Only ADMIN can manage payment methods",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

---

## ⚠️ Error Handling

### Standard Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHENTICATED` | No valid JWT token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `BAD_USER_INPUT` | Invalid input data | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `INTERNAL_SERVER_ERROR` | Server error | 500 |

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Human-readable error message",
      "extensions": {
        "code": "ERROR_CODE",
        "field": "fieldName",  // Optional
        "details": {}          // Optional additional context
      },
      "path": ["mutation", "fieldName"],
      "locations": [{ "line": 2, "column": 3 }]
    }
  ]
}
```

### Common Errors

#### Country Restriction Violation
```json
{
  "errors": [
    {
      "message": "Cannot access restaurant from different country",
      "extensions": {
        "code": "FORBIDDEN",
        "userCountry": "INDIA",
        "restaurantCountry": "AMERICA"
      }
    }
  ]
}
```

#### Order Status Conflict
```json
{
  "errors": [
    {
      "message": "Cannot modify order with status CONFIRMED",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "currentStatus": "CONFIRMED",
        "allowedStatuses": ["DRAFT"]
      }
    }
  ]
}
```

---

## 🧪 Testing Queries

### GraphQL Playground

Access at: `http://localhost:4000/graphql`

Enable introspection in development:
```typescript
GraphQLModule.forRoot({
  playground: true,
  introspection: true,
});
```

### Sample Test Suite

```graphql
# 1. Register as Member (India)
mutation { register(input: {...}) { token } }

# 2. Login
mutation { login(input: {...}) { token } }

# 3. View Indian restaurants only
query { restaurants { id name country } }

# 4. Try to view American restaurants (should fail or return empty)
query { restaurant(id: "american-restaurant-id") { id name } }

# 5. Create order for Indian restaurant
mutation { createOrder(input: {restaurantId: "..."}) { id } }

# 6. Add items to order
mutation { addOrderItem(input: {...}) { id } }

# 7. Try to checkout as Member (should fail)
mutation { checkout(input: {...}) { id } }

# 8. Login as Manager
mutation { login(input: {email: "manager@...", ...}) { token } }

# 9. Checkout as Manager (should succeed)
mutation { checkout(input: {...}) { id status } }

# 10. Cancel order as Manager
mutation { cancelOrder(orderId: "...") { id status } }
```

---

## 📚 Additional Resources

- **GraphQL Specification**: https://spec.graphql.org/
- **NestJS GraphQL**: https://docs.nestjs.com/graphql/quick-start
- **Apollo Client Docs**: https://www.apollographql.com/docs/react/
- **Prisma GraphQL**: https://www.prisma.io/docs/concepts/overview/what-is-prisma/data-modeling

---

**API Version**: 1.0  
**Last Updated**: January 2026
