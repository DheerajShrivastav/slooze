import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: string, userCountry: string) {
    const where: any = { isActive: true }

    // Apply country filtering for non-admin users (Re-BAC)
    if (userRole !== 'ADMIN') {
      where.country = userCountry
    }

    return await this.prisma.restaurant.findMany({
      where,
      orderBy: { rating: 'desc' },
    })
  }

  async findOne(id: string, userRole: string, userCountry: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
        },
      },
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found')
    }

    // Check country access for non-admin users
    if (userRole !== 'ADMIN' && restaurant.country !== userCountry) {
      throw new ForbiddenException('Access denied to this restaurant')
    }

    return restaurant
  }

  async getMenuItems(restaurantId: string) {
    return await this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
      orderBy: { category: 'asc' },
    })
  }
}
