import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  AddPaymentMethodInput,
  UpdatePaymentMethodInput,
} from './dto/payment-method.types'

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.paymentMethod.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async findAvailable() {
    return await this.prisma.paymentMethod.findMany({
      where: {
        expiryYear: { gte: new Date().getFullYear() },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async findOne(id: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    return paymentMethod
  }

  async create(input: AddPaymentMethodInput) {
    // If this is set as default, unset other defaults
    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    return await this.prisma.paymentMethod.create({
      data: {
        type: input.type,
        provider: input.provider,
        last4Digits: input.last4Digits,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        isDefault: input.isDefault ?? false,
      },
    })
  }

  async update(id: string, input: UpdatePaymentMethodInput) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    // If setting this as default, unset other defaults
    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    return await this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(input.type && { type: input.type }),
        ...(input.provider && { provider: input.provider }),
        ...(input.last4Digits && { last4Digits: input.last4Digits }),
        ...(input.expiryMonth !== undefined && {
          expiryMonth: input.expiryMonth,
        }),
        ...(input.expiryYear !== undefined && { expiryYear: input.expiryYear }),
        ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
      },
    })
  }

  async delete(id: string): Promise<boolean> {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
        },
      },
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    // Cannot delete payment method used in active orders
    if (paymentMethod.orders.length > 0) {
      throw new BadRequestException(
        'Cannot delete payment method used in active orders'
      )
    }

    await this.prisma.paymentMethod.delete({
      where: { id },
    })

    return true
  }
}
