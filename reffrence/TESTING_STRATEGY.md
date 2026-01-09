# Testing Strategy
## Slooze Food Ordering Platform

---

## 🎯 Testing Objectives

1. **Ensure Role-Based Access Control**: Verify all RBAC permissions work correctly
2. **Validate Country-Based Restrictions**: Test Re-BAC country filtering
3. **Verify Business Logic**: All order flows work as expected
4. **Prevent Regressions**: Catch bugs before deployment
5. **Document Behavior**: Tests serve as living documentation

**Coverage Target**: 80%+ overall, 100% for critical paths

---

## 🧪 Testing Levels

### 1. Unit Tests
**Scope**: Individual functions, services, utilities

**Framework**: Jest

**What to Test**:
- Service methods
- Utility functions
- Validators
- Transformers

### 2. Integration Tests
**Scope**: Multiple modules working together

**Framework**: Jest + Supertest (backend), Testing Library (frontend)

**What to Test**:
- GraphQL resolvers with database
- Authentication flow
- Guards and middleware
- API endpoints

### 3. E2E Tests
**Scope**: Complete user flows

**Framework**: Playwright or Cypress

**What to Test**:
- User registration and login
- Browse restaurants and order
- Checkout process (Manager)
- Payment method management (Admin)

---

## 🔧 Backend Testing

### Test Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts       # Unit tests
│   ├── orders/
│   │   ├── orders.service.ts
│   │   ├── orders.service.spec.ts     # Unit tests
│   │   └── orders.resolver.spec.ts    # Integration tests
├── test/
│   ├── auth.e2e-spec.ts               # E2E tests
│   ├── orders.e2e-spec.ts
│   └── rbac.e2e-spec.ts
```

---

### Unit Tests

#### Auth Service Tests

**File**: `src/auth/auth.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const registerInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        country: 'INDIA',
      };

      const mockUser = {
        id: '123',
        ...registerInput,
        password: 'hashed-password',
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register(registerInput);

      expect(result.user.email).toBe(registerInput.email);
      expect(result.token).toBe('mock-jwt-token');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerInput.email,
          password: expect.not.stringMatching(registerInput.password), // Hashed
          name: registerInput.name,
          country: registerInput.country,
          role: 'MEMBER',
        }),
      });
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error('Unique constraint violation')
      );

      await expect(
        service.register({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Test',
          country: 'INDIA',
        })
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'MEMBER',
        country: 'INDIA',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

#### Orders Service Tests

**File**: `src/orders/orders.service.spec.ts`

```typescript
describe('OrdersService', () => {
  describe('createOrder', () => {
    it('should create order for user in same country as restaurant', async () => {
      const user = { id: '1', country: 'INDIA', role: 'MEMBER' };
      const restaurant = { id: 'r1', country: 'INDIA' };

      mockPrisma.restaurant.findUnique.mockResolvedValue(restaurant);
      mockPrisma.order.create.mockResolvedValue({
        id: 'o1',
        userId: user.id,
        restaurantId: restaurant.id,
        status: 'DRAFT',
        totalAmount: 0,
      });

      const result = await service.createOrder(user, { restaurantId: 'r1' });

      expect(result.id).toBe('o1');
    });

    it('should prevent order from different country (Member)', async () => {
      const user = { id: '1', country: 'INDIA', role: 'MEMBER' };
      const restaurant = { id: 'r1', country: 'AMERICA' };

      mockPrisma.restaurant.findUnique.mockResolvedValue(restaurant);

      await expect(
        service.createOrder(user, { restaurantId: 'r1' })
      ).rejects.toThrow('Cannot order from restaurant in different country');
    });

    it('should allow Admin to order from any country', async () => {
      const user = { id: '1', country: 'INDIA', role: 'ADMIN' };
      const restaurant = { id: 'r1', country: 'AMERICA' };

      mockPrisma.restaurant.findUnique.mockResolvedValue(restaurant);
      mockPrisma.order.create.mockResolvedValue({ id: 'o1' });

      const result = await service.createOrder(user, { restaurantId: 'r1' });

      expect(result.id).toBe('o1');
    });
  });

  describe('checkout', () => {
    it('should allow Manager to checkout', async () => {
      const user = { id: '1', role: 'MANAGER' };
      const order = { id: 'o1', userId: '1', status: 'DRAFT' };

      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockPrisma.order.update.mockResolvedValue({
        ...order,
        status: 'PENDING',
        paidAt: new Date(),
      });

      const result = await service.checkout(user, {
        orderId: 'o1',
        paymentMethodId: 'pm1',
      });

      expect(result.status).toBe('PENDING');
      expect(result.paidAt).toBeTruthy();
    });

    it('should prevent Member from checkout', async () => {
      const user = { id: '1', role: 'MEMBER' };

      // This should be caught by RolesGuard before reaching service
      // But we can still test the service logic
      await expect(
        service.checkout(user, {
          orderId: 'o1',
          paymentMethodId: 'pm1',
        })
      ).rejects.toThrow('Insufficient permissions');
    });
  });
});
```

---

### Integration Tests

#### RBAC Integration Tests

**File**: `test/rbac.e2e-spec.ts`

```typescript
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('RBAC (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let memberToken: string;
  let managerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Create test users and get tokens
    const memberRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            register(input: {
              email: "member@test.com"
              password: "password123"
              name: "Member"
              country: INDIA
            }) {
              token
            }
          }
        `,
      });
    memberToken = memberRes.body.data.register.token;

    // Manually set role to MANAGER for manager user
    // (In real app, Admin would do this)
    const managerRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            register(input: {
              email: "manager@test.com"
              password: "password123"
              name: "Manager"
              country: INDIA
            }) {
              token
              user { id }
            }
          }
        `,
      });
    
    const managerId = managerRes.body.data.register.user.id;
    await prisma.user.update({
      where: { id: managerId },
      data: { role: 'MANAGER' },
    });
    
    // Re-login to get updated token
    const managerLoginRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(input: {
              email: "manager@test.com"
              password: "password123"
            }) {
              token
            }
          }
        `,
      });
    managerToken = managerLoginRes.body.data.login.token;

    // Similar for Admin...
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Checkout Permission', () => {
    it('should allow Manager to checkout', async () => {
      // Create order first
      const createOrderRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          query: `
            mutation {
              createOrder(input: { restaurantId: "${testRestaurantId}" }) {
                id
              }
            }
          `,
        });

      const orderId = createOrderRes.body.data.createOrder.id;

      // Checkout
      const checkoutRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          query: `
            mutation {
              checkout(input: {
                orderId: "${orderId}"
                paymentMethodId: "${testPaymentMethodId}"
              }) {
                id
                status
              }
            }
          `,
        });

      expect(checkoutRes.body.data.checkout.status).toBe('PENDING');
    });

    it('should prevent Member from checkout', async () => {
      const createOrderRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          query: `
            mutation {
              createOrder(input: { restaurantId: "${testRestaurantId}" }) {
                id
              }
            }
          `,
        });

      const orderId = createOrderRes.body.data.createOrder.id;

      const checkoutRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          query: `
            mutation {
              checkout(input: {
                orderId: "${orderId}"
                paymentMethodId: "${testPaymentMethodId}"
              }) {
                id
              }
            }
          `,
        });

      expect(checkoutRes.body.errors).toBeDefined();
      expect(checkoutRes.body.errors[0].extensions.code).toBe('FORBIDDEN');
    });
  });

  describe('Payment Method Management', () => {
    it('should allow Admin to add payment method', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query: `
            mutation {
              addPaymentMethod(input: {
                type: CREDIT_CARD
                provider: "Visa"
                last4Digits: "1234"
                expiryMonth: 12
                expiryYear: 2026
              }) {
                id
                type
              }
            }
          `,
        });

      expect(res.body.data.addPaymentMethod.type).toBe('CREDIT_CARD');
    });

    it('should prevent Manager from adding payment method', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          query: `
            mutation {
              addPaymentMethod(input: {
                type: CREDIT_CARD
                provider: "Visa"
                last4Digits: "1234"
                expiryMonth: 12
                expiryYear: 2026
              }) {
                id
              }
            }
          `,
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
    });
  });
});
```

---

## 🎨 Frontend Testing

### Component Tests

**Framework**: React Testing Library + Jest

**File**: `src/components/auth/LoginForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        input: { email: 'test@example.com', password: 'password123' },
      },
    },
    result: {
      data: {
        login: {
          token: 'mock-token',
          user: { id: '1', email: 'test@example.com', role: 'MEMBER' },
        },
      },
    },
  },
];

describe('LoginForm', () => {
  it('should render login form', () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MockedProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid credentials', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/restaurants');
    });
  });
});
```

**File**: `src/components/cart/CartDrawer.test.tsx`

```typescript
describe('CartDrawer', () => {
  it('should disable checkout button for Members', () => {
    const mockUser = { id: '1', role: 'MEMBER', country: 'INDIA' };

    render(
      <AuthProvider value={{ user: mockUser }}>
        <CartProvider>
          <CartDrawer isOpen={true} onClose={jest.fn()} />
        </CartProvider>
      </AuthProvider>
    );

    const checkoutButton = screen.getByRole('button', {
      name: /members cannot checkout/i,
    });
    expect(checkoutButton).toBeDisabled();
  });

  it('should enable checkout button for Managers', () => {
    const mockUser = { id: '1', role: 'MANAGER', country: 'INDIA' };

    render(
      <AuthProvider value={{ user: mockUser }}>
        <CartProvider>
          <CartDrawer isOpen={true} onClose={jest.fn()} />
        </CartProvider>
      </AuthProvider>
    );

    const checkoutButton = screen.getByRole('button', {
      name: /proceed to checkout/i,
    });
    expect(checkoutButton).not.toBeDisabled();
  });
});
```

---

### E2E Tests

**Framework**: Playwright

**File**: `e2e/order-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Complete Order Flow', () => {
  test('Member can create order but cannot checkout', async ({ page }) => {
    // Login as Member
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'member@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to restaurants
    await page.waitForURL('**/restaurants');
    await expect(page).toHaveURL(/restaurants/);

    // Click on a restaurant
    await page.click('[data-testid="restaurant-card"]:first-child');

    // Add item to cart
    await page.click('[data-testid="add-to-cart"]:first-child');

    // Open cart
    await page.click('[data-testid="cart-icon"]');

    // Verify checkout button is disabled
    const checkoutButton = page.locator('button:has-text("Checkout")');
    await expect(checkoutButton).toBeDisabled();

    // Verify message is shown
    await expect(page.locator('text=Members cannot checkout')).toBeVisible();
  });

  test('Manager can complete full order flow', async ({ page }) => {
    // Login as Manager
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'manager@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Create order
    await page.goto('http://localhost:3000/restaurants');
    await page.click('[data-testid="restaurant-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]:first-child');

    // Proceed to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('button:has-text("Proceed to Checkout")');

    // Fill checkout form
    await page.selectOption('[name="paymentMethodId"]', { index: 0 });
    await page.fill('[name="deliveryAddress"]', '123 Test St');
    
    // Complete checkout
    await page.click('button:has-text("Place Order")');

    // Verify success
    await expect(page.locator('text=Order placed successfully')).toBeVisible();
    await expect(page).toHaveURL(/orders/);
  });
});
```

---

## 📊 Test Coverage Reports

### Running Tests

```bash
# Backend
cd backend
npm run test              # Run all unit tests
npm run test:cov          # With coverage
npm run test:e2e          # E2E tests

# Frontend
cd frontend
npm run test              # Run all tests
npm run test:coverage     # With coverage

# E2E
npm run test:e2e
```

### Coverage Thresholds

**jest.config.js**:
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## ✅ Test Checklist

### RBAC Tests
- [ ] Member cannot checkout
- [ ] Member cannot cancel orders
- [ ] Member cannot manage payment methods
- [ ] Manager can checkout
- [ ] Manager can cancel orders
- [ ] Manager cannot manage payment methods
- [ ] Admin has full access

### Country-Based Access (Re-BAC)
- [ ] Indian user sees only Indian restaurants
- [ ] American user sees only American restaurants
- [ ] Admin sees all restaurants
- [ ] Cannot order from different country (except Admin)
- [ ] Orders filtered by country

### Order Flow
- [ ] Can create order
- [ ] Can add items to order
- [ ] Can update item quantities
- [ ] Can remove items
- [ ] Total calculates correctly
- [ ] Checkout updates status
- [ ] Cancel order works

### Authentication
- [ ] Can register
- [ ] Can login
- [ ] Token stored correctly
- [ ] Protected routes require auth
- [ ] Logout clears session

---

**Document Version**: 1.0  
**Last Updated**: January 2026
