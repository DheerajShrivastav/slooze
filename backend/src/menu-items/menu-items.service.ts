import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMenuItemInput, UpdateMenuItemInput } from './dto/menu-item.types'

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    restaurantId: string,
    userRole: string,
    userCountry: string,
    filters?: {
      category?: string
      isAvailable?: boolean
      isVegetarian?: boolean
    }
  ) {
    // First check if the restaurant is accessible
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found')
    }

    // Country-based access control for non-admin users
    if (userRole !== 'ADMIN' && restaurant.country !== userCountry) {
      throw new ForbiddenException('Access denied to this restaurant')
    }

    const where: any = { restaurantId }

    if (filters?.category) {
      where.category = filters.category
    }
    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable
    }
    if (filters?.isVegetarian !== undefined) {
      where.isVegetarian = filters.isVegetarian
    }

    return await this.prisma.menuItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
  }

  async findOne(id: string, userRole: string, userCountry: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { restaurant: true },
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found')
    }

    // Country-based access control for non-admin users
    if (userRole !== 'ADMIN' && menuItem.restaurant.country !== userCountry) {
      throw new ForbiddenException('Access denied to this menu item')
    }

    return menuItem
  }

  async create(input: CreateMenuItemInput) {
    // Verify restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found')
    }

    return await this.prisma.menuItem.create({
      data: {
        restaurantId: input.restaurantId,
        name: input.name,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
        category: input.category,
        isAvailable: input.isAvailable ?? true,
        isVegetarian: input.isVegetarian ?? false,
      },
    })
  }

  async update(id: string, input: UpdateMenuItemInput) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found')
    }

    return await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.imageUrl && { imageUrl: input.imageUrl }),
        ...(input.category && { category: input.category }),
        ...(input.isAvailable !== undefined && {
          isAvailable: input.isAvailable,
        }),
        ...(input.isVegetarian !== undefined && {
          isVegetarian: input.isVegetarian,
        }),
      },
    })
  }

  async delete(id: string): Promise<boolean> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found')
    }

    await this.prisma.menuItem.delete({
      where: { id },
    })

    return true
  }
}
