import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role, Country } from '../auth/dto/auth.types'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { role?: Role; country?: Country }) {
    const where: any = {}

    if (filters?.role) {
      where.role = filters.role
    }
    if (filters?.country) {
      where.country = filters.country
    }

    return await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async updateCountry(userId: string, country: Country) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { country },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
