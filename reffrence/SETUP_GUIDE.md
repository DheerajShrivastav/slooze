# Development Setup Guide
## Slooze Food Ordering Platform

---

## 🎯 Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x or higher | Runtime for both frontend and backend |
| npm | 9.x or higher | Package manager |
| PostgreSQL | 14.x or higher | Database |
| Git | 2.x or higher | Version control |

### Optional Tools
- **Docker** (recommended): For containerized database
- **VS Code**: Recommended IDE with plugins
- **Postman/Insomnia**: For API testing (alternative to GraphQL Playground)

---

## 📦 Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd slooze-food-ordering
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Create docker-compose.yml in project root
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: slooze_db
    environment:
      POSTGRES_USER: slooze
      POSTGRES_PASSWORD: slooze_password
      POSTGRES_DB: slooze_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start database
docker-compose up -d

# Verify it's running
docker ps
```

#### Option B: Local PostgreSQL Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE slooze_db;
CREATE USER slooze WITH PASSWORD 'slooze_password';
GRANT ALL PRIVILEGES ON DATABASE slooze_db TO slooze;
\q
```

---

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://slooze:slooze_password@localhost:5432/slooze_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=development
EOF

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with mock data
npx prisma db seed

# Start development server
npm run start:dev
```

**Verify Backend**:
- Open http://localhost:4000/graphql
- GraphQL Playground should load
- Run test query:
  ```graphql
  query {
    restaurants {
      id
      name
      country
    }
  }
  ```

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << 'EOF'
# Backend API URL
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Environment
NEXT_PUBLIC_ENV=development
EOF

# Start development server
npm run dev
```

**Verify Frontend**:
- Open http://localhost:3000
- Homepage should load
- Navigate to /login

---

## 🔧 Environment Variables Reference

### Backend (.env)

```bash
# Required
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key"

# Optional
PORT=4000
NODE_ENV=development
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```bash
# Required
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Optional
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_ENABLE_LOGGING=true
```

---

## 📝 Prisma Commands

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_change

# Apply migrations to production
npx prisma migrate deploy

# Reset database (dev only - deletes all data!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Seed Database

```bash
# Run seed script
npx prisma db seed

# Or manually
npx tsx prisma/seed.ts
```

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Tests

```bash
# Install Playwright (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npx playwright test --ui
```

---

## 🚀 Development Workflow

### Daily Startup

```bash
# Terminal 1: Database (if using Docker)
docker-compose up

# Terminal 2: Backend
cd backend
npm run start:dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Making Database Changes

1. Update `backend/prisma/schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```
3. Prisma Client auto-regenerates
4. Update your code to use new schema

### Adding New Features

1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement backend changes (schema, service, resolver)
3. Write backend tests
4. Implement frontend changes (components, pages)
5. Write frontend tests
6. Test manually
7. Commit and push
8. Create pull request

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
```bash
# Check if PostgreSQL is running
docker ps  # If using Docker
sudo systemctl status postgresql  # If local

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection manually
psql postgresql://slooze:slooze_password@localhost:5432/slooze_db
```

### Prisma Client Issues

**Error**: `Prisma Client not generated`

**Solution**:
```bash
npx prisma generate
```

**Error**: `Migration out of sync`

**Solution** (dev only):
```bash
npx prisma migrate reset
npx prisma db seed
```

### Port Already in Use

**Error**: `Port 4000 is already in use`

**Solutions**:
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=4001
```

### GraphQL Playground Not Loading

**Checks**:
1. Ensure backend is running: `curl http://localhost:4000/graphql`
2. Check browser console for errors
3. Verify `playground: true` in `app.module.ts`:
   ```typescript
   GraphQLModule.forRoot({
     playground: true,
     introspection: true,
   })
   ```

### Frontend Build Errors

**Error**: `Module not found`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📚 Useful Commands

### npm Scripts

#### Backend
```bash
npm run start           # Production start
npm run start:dev       # Development with hot reload
npm run start:debug     # Development with debugging
npm run build           # Build for production
npm run test            # Run tests
npm run test:e2e        # Run E2E tests
npm run lint            # Lint code
npm run format          # Format with Prettier
```

#### Frontend
```bash
npm run dev             # Development server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Lint code
npm run test            # Run tests
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name

# Update from main
git checkout main
git pull
git checkout feature/feature-name
git rebase main
```

---

## 🔐 Seed Data Reference

After running `npx prisma db seed`, you'll have:

### Test Users

| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin@slooze.xyz | Admin@123 | ADMIN | INDIA |
| manager.india@slooze.xyz | Manager@123 | MANAGER | INDIA |
| manager.america@slooze.xyz | Manager@123 | MANAGER | AMERICA |
| member.india@slooze.xyz | Member@123 | MEMBER | INDIA |
| member.america@slooze.xyz | Member@123 | MEMBER | AMERICA |

### Restaurants
- 5 Indian restaurants
- 5 American restaurants
- Each with 5-10 menu items

### Payment Methods
- 3 credit cards
- 2 UPI methods

---

## 🎓 IDE Setup (VS Code)

### Recommended Extensions

```json
{
  "recommendations": [
    "prisma.prisma",
    "graphql.vscode-graphql",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker"
  ]
}
```

Save as `.vscode/extensions.json`

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

Save as `.vscode/settings.json`

---

## 📖 Learning Resources

### Official Documentation
- [NestJS](https://docs.nestjs.com)
- [Prisma](https://www.prisma.io/docs)
- [GraphQL](https://graphql.org/learn)
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutorials
- [NestJS GraphQL Tutorial](https://docs.nestjs.com/graphql/quick-start)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Apollo Client React](https://www.apollographql.com/docs/react)

---

## ✅ Setup Verification Checklist

- [ ] PostgreSQL database running
- [ ] Backend server starts without errors
- [ ] GraphQL Playground accessible at http://localhost:4000/graphql
- [ ] Prisma migrations applied
- [ ] Database seeded with test data
- [ ] Frontend server starts without errors
- [ ] Can navigate to http://localhost:3000
- [ ] Can login with test user credentials
- [ ] Can view restaurants
- [ ] Backend tests pass
- [ ] Frontend tests pass

---

## 🚢 Production Deployment

### Backend (Railway/Heroku)

1. **Create account** on Railway or Heroku
2. **Create new project**
3. **Add PostgreSQL database**
4. **Set environment variables**:
   - `DATABASE_URL` (automatically set by platform)
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. **Deploy**:
   ```bash
   git push railway main
   # or
   git push heroku main
   ```
6. **Run migrations**:
   ```bash
   railway run npx prisma migrate deploy
   # or
   heroku run npx prisma migrate deploy
   ```

### Frontend (Vercel)

1. **Create account** on Vercel
2. **Import GitHub repository**
3. **Set root directory**: `frontend`
4. **Set environment variables**:
   - `NEXT_PUBLIC_GRAPHQL_URL`: Your backend URL
5. **Deploy**: Automatic on push to main

---

## 📞 Support

For issues or questions:
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Review documentation in `/reffrence` folder
- Contact: careers@slooze.xyz

---

**Document Version**: 1.0  
**Last Updated**: January 2026
