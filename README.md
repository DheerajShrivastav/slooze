# 🍔 Slooze - Food Ordering Platform

A full-stack, role-based food ordering web application built with **NestJS**, **GraphQL**, **Prisma**, and **Next.js**.

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

---

## ✨ Why This Submission is Unique

This project goes beyond the basic requirements to deliver a **production-ready, enterprise-grade** food ordering platform with thoughtful architecture and enhanced user experience.

### 🏆 Key Differentiators

| Feature                          | Description                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| **Dual Access Control**          | Combines RBAC (Role-Based) + Re-BAC (Resource-Based) for granular permissions           |
| **Country-Based Filtering**      | Users only see restaurants from their assigned country - true multi-tenant architecture |
| **Real-time Receipt Generation** | Download professional PDF receipts for any order                                        |
| **Complete Admin Dashboard**     | Full CRUD operations for users, orders, menu items, and payment methods                 |
| **Modern Tech Stack**            | Next.js 16 + React 19 + NestJS + GraphQL + Prisma - cutting-edge technologies           |
| **Type-Safe End-to-End**         | TypeScript throughout with auto-generated GraphQL types                                 |

### 🎯 Additional Features Implemented

- **📊 Admin Dashboard** - Comprehensive management interface for administrators and managers
- **👥 User Management** - Create, edit, delete users with role and country assignment
- **🧾 Receipt Generation** - Generate and download professional PDF receipts for orders
- **🍽️ Menu Items Management** - Full CRUD for restaurant menu items with availability toggle
- **🛒 Shopping Cart** - Persistent cart with quantity management and subtotal calculation
- **🔍 Restaurant Search & Filter** - Search by name and filter by cuisine type
- **🌍 Multi-Country Support** - Built-in support for India, USA, UK, and Canada
- **🔐 Secure Authentication** - JWT-based auth with bcrypt password hashing
- **📱 Responsive Design** - Mobile-first UI with Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **PostgreSQL** database
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slooze
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
bun install
# or: npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/slooze"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
bun prisma:generate
# or: npx prisma generate

# Run database migrations
bun prisma:migrate
# or: npx prisma migrate dev

# Seed the database with sample data
bun prisma:seed
# or: npx ts-node prisma/seed.ts

# Start the development server
bun start:dev
# or: npm run start:dev
```

Backend runs at: **http://localhost:4000/graphql**

### 3. Setup Frontend

```bash
cd slooze-app

# Install dependencies
bun install
# or: npm install

# Start the development server
bun dev
# or: npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Default Users (from seed data)

| Email              | Password   | Role    | Country |
| ------------------ | ---------- | ------- | ------- |
| admin@slooze.com   | admin123   | ADMIN   | INDIA   |
| manager@slooze.com | manager123 | MANAGER | INDIA   |
| member@slooze.com  | member123  | MEMBER  | INDIA   |

---

## 🎭 User Roles & Permissions

| Feature                | Admin | Manager | Member |
| ---------------------- | ----- | ------- | ------ |
| View Restaurants       | ✅    | ✅      | ✅     |
| View Menu Items        | ✅    | ✅      | ✅     |
| Create Orders          | ✅    | ✅      | ✅     |
| View Order History     | ✅    | ✅      | ✅     |
| Access Admin Dashboard | ✅    | ✅      | ❌     |
| Manage Users           | ✅    | ❌      | ❌     |
| Manage Payment Methods | ✅    | ❌      | ❌     |
| Manage Menu Items      | ✅    | ✅      | ❌     |
| Process Orders         | ✅    | ✅      | ❌     |

---

## 🛠️ Tech Stack

## 📋 Features

- **Role-Based Access Control (RBAC)** - Admin, Manager, and Member roles
- **Country-Based Filtering (Re-BAC)** - Users see restaurants from their assigned country
- **Restaurant Browsing** - Search and filter restaurants by cuisine
- **Order Management** - Create, view, and track orders
- **Admin Dashboard** - Manage users, orders, menu items, and payment methods
- **Receipt Generation** - View and download order receipts as PDF

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   (Next.js 16 + React 19)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │  Components │  │  Context Providers  │ │
│  │  /app/*     │  │  /ui, /layout│ │  Auth, Cart, Apollo │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ GraphQL (Apollo Client)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
│                 (NestJS + Apollo Server)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Resolvers  │  │  Services   │  │  Guards & Decorators│ │
│  │  (GraphQL)  │  │  (Business) │  │  (RBAC, JWT, Country)│ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ Prisma ORM
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│   Users | Restaurants | MenuItems | Orders | PaymentMethods │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
slooze/
├── backend/                 # NestJS Backend API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Seed data
│   │   └── migrations/      # Database migrations
│   └── src/
│       ├── auth/            # Authentication & Authorization
│       ├── restaurants/     # Restaurant management
│       ├── menu-items/      # Menu item CRUD
│       ├── orders/          # Order management
│       ├── payment-methods/ # Payment method CRUD
│       ├── users/           # User management
│       └── prisma/          # Prisma service
│
├── slooze-app/              # Next.js Frontend
│   ├── app/
│   │   ├── auth/            # Login & Signup pages
│   │   ├── restaurants/     # Restaurant listing & details
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── orders/          # Order history
│   │   └── admin/           # Admin dashboard
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Header, Footer
│   └── lib/                 # Context providers & utilities
│
└── reffrence/               # Documentation
```

---

### Backend

- **NestJS** - Node.js framework
- **GraphQL** - API layer with Apollo Server
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend

- **Next.js 16** - React framework (App Router)
- **React 19** - UI library
- **Apollo Client** - GraphQL client
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

---

## 📡 API Endpoints

GraphQL Playground: **http://localhost:3000/graphql**

### Key Queries

- `restaurants` - List all restaurants
- `restaurant(id)` - Get restaurant with menu
- `myOrders` - Get current user's orders
- `orders` - Get all orders (Admin/Manager)

### Key Mutations

- `register` / `login` - Authentication
- `createOrder` - Create new order
- `addOrderItem` - Add item to order
- `updateOrderStatus` - Update order status
- `createPaymentMethod` - Add payment method (Admin)

---

## 🧪 Testing the App

1. **Sign up** or use a default user
2. **Browse restaurants** and view menus
3. **Add items** to your cart
4. **Checkout** to place an order
5. **View orders** in "My Orders"
6. **Admin users** can access the dashboard at `/admin`

---

## 📝 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/slooze"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### Frontend

The frontend connects to `http://localhost:3000/graphql` by default. This is configured in `lib/apollo-provider.tsx`.

---

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

---

## 🙏 Acknowledgments

Built as a demonstration of enterprise-grade access control patterns in a modern full-stack application.
