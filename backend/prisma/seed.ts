import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const memberPassword = await bcrypt.hash('member123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@slooze.xyz' },
        update: {},
        create: {
            email: 'admin@slooze.xyz',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
            country: 'INDIA',
        },
    });

    const managerIndia = await prisma.user.upsert({
        where: { email: 'manager.india@slooze.xyz' },
        update: {},
        create: {
            email: 'manager.india@slooze.xyz',
            password: managerPassword,
            name: 'India Manager',
            role: 'MANAGER',
            country: 'INDIA',
        },
    });

    const managerAmerica = await prisma.user.upsert({
        where: { email: 'manager.america@slooze.xyz' },
        update: {},
        create: {
            email: 'manager.america@slooze.xyz',
            password: managerPassword,
            name: 'America Manager',
            role: 'MANAGER',
            country: 'AMERICA',
        },
    });

    const memberIndia = await prisma.user.upsert({
        where: { email: 'member.india@slooze.xyz' },
        update: {},
        create: {
            email: 'member.india@slooze.xyz',
            password: memberPassword,
            name: 'Indian Member',
            role: 'MEMBER',
            country: 'INDIA',
        },
    });

    const memberAmerica = await prisma.user.upsert({
        where: { email: 'member.america@slooze.xyz' },
        update: {},
        create: {
            email: 'member.america@slooze.xyz',
            password: memberPassword,
            name: 'American Member',
            role: 'MEMBER',
            country: 'AMERICA',
        },
    });

    console.log('✅ Created users');

    // Create Indian restaurants
    const tandoori = await prisma.restaurant.upsert({
        where: { id: 'india-restaurant-1' },
        update: {},
        create: {
            id: 'india-restaurant-1',
            name: 'Tandoori Delights',
            description: 'Authentic North Indian cuisine with traditional clay oven cooking',
            imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
            country: 'INDIA',
            cuisine: 'North Indian',
            rating: 4.5,
            deliveryTime: '30-40 min',
            isActive: true,
        },
    });

    const dosa = await prisma.restaurant.upsert({
        where: { id: 'india-restaurant-2' },
        update: {},
        create: {
            id: 'india-restaurant-2',
            name: 'Dosa Palace',
            description: 'South Indian specialties and crispy dosas',
            imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
            country: 'INDIA',
            cuisine: 'South Indian',
            rating: 4.7,
            deliveryTime: '25-35 min',
            isActive: true,
        },
    });

    // Create American restaurants
    const burgerBarn = await prisma.restaurant.upsert({
        where: { id: 'america-restaurant-1' },
        update: {},
        create: {
            id: 'america-restaurant-1',
            name: 'Burger Barn',
            description: 'Classic American burgers and fries',
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
            country: 'AMERICA',
            cuisine: 'American',
            rating: 4.3,
            deliveryTime: '20-30 min',
            isActive: true,
        },
    });

    const pizzaParadise = await prisma.restaurant.upsert({
        where: { id: 'america-restaurant-2' },
        update: {},
        create: {
            id: 'america-restaurant-2',
            name: 'Pizza Paradise',
            description: 'New York style pizzas and Italian classics',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
            country: 'AMERICA',
            cuisine: 'Italian-American',
            rating: 4.6,
            deliveryTime: '35-45 min',
            isActive: true,
        },
    });

    console.log('✅ Created restaurants');

    // Create menu items for Tandoori Delights
    await prisma.menuItem.createMany({
        data: [
            {
                restaurantId: tandoori.id,
                name: 'Butter Chicken',
                description: 'Creamy tomato-based chicken curry with aromatic spices',
                price: 299.00,
                imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
                category: 'Main Course',
                isVegetarian: false,
                isAvailable: true,
            },
            {
                restaurantId: tandoori.id,
                name: 'Paneer Tikka',
                description: 'Grilled cottage cheese marinated in spices',
                price: 249.00,
                imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
                category: 'Appetizer',
                isVegetarian: true,
                isAvailable: true,
            },
            {
                restaurantId: tandoori.id,
                name: 'Garlic Naan',
                description: 'Soft flatbread with garlic and butter',
                price: 49.00,
                imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
                category: 'Bread',
                isVegetarian: true,
                isAvailable: true,
            },
        ],
        skipDuplicates: true,
    });

    // Create menu items for Burger Barn
    await prisma.menuItem.createMany({
        data: [
            {
                restaurantId: burgerBarn.id,
                name: 'Classic Cheeseburger',
                description: 'Beef patty with cheddar cheese, lettuce, and tomato',
                price: 12.99,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                category: 'Main Course',
                isVegetarian: false,
                isAvailable: true,
            },
            {
                restaurantId: burgerBarn.id,
                name: 'French Fries',
                description: 'Crispy golden fries with sea salt',
                price: 4.99,
                imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
                category: 'Sides',
                isVegetarian: true,
                isAvailable: true,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created menu items');

    // Create payment methods
    await prisma.paymentMethod.createMany({
        data: [
            {
                userId: admin.id,
                type: 'CREDIT_CARD',
                provider: 'Visa',
                last4Digits: '4242',
                expiryMonth: 12,
                expiryYear: 2026,
                isDefault: true,
            },
            {
                userId: admin.id,
                type: 'UPI',
                provider: 'Google Pay',
                last4Digits: '9876',
                expiryMonth: 12,
                expiryYear: 2099,
                isDefault: false,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Created payment methods');
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nTest Users:');
    console.log('- admin@slooze.xyz / admin123 (ADMIN, INDIA)');
    console.log('- manager.india@slooze.xyz / manager123 (MANAGER, INDIA)');
    console.log('- manager.america@slooze.xyz / manager123 (MANAGER, AMERICA)');
    console.log('- member.india@slooze.xyz / member123 (MEMBER, INDIA)');
    console.log('- member.america@slooze.xyz / member123 (MEMBER, AMERICA)');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
