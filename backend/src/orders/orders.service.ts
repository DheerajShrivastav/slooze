import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  CreateOrderInput,
  AddOrderItemInput,
  UpdateOrderItemInput,
  CheckoutInput,
  OrderStatus,
} from './dto/order.types'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findMyOrders(
    userId: string,
    filters?: {
      status?: OrderStatus
      limit?: number
      offset?: number
    }
  ) {
    const where: any = { userId }

    if (filters?.status) {
      where.status = filters.status
    }

    return await this.prisma.order.findMany({
      where,
      include: {
        orderItems: true,
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 10,
      skip: filters?.offset || 0,
    })
  }

  async findOne(id: string, userId: string, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { menuItem: true },
        },
        restaurant: true,
        paymentMethod: true,
      },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    // Only owner or admin can view the order
    if (userRole !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    return order
  }

  async findAll(filters?: {
    userId?: string
    restaurantId?: string
    status?: OrderStatus
    country?: string
  }) {
    const where: any = {}

    if (filters?.userId) {
      where.userId = filters.userId
    }
    if (filters?.restaurantId) {
      where.restaurantId = filters.restaurantId
    }
    if (filters?.status) {
      where.status = filters.status
    }
    if (filters?.country) {
      where.restaurant = { country: filters.country }
    }

    return await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(
    userId: string,
    userRole: string,
    userCountry: string,
    input: CreateOrderInput
  ) {
    // Verify restaurant exists and is accessible
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found')
    }

    // Country-based access control for non-admin users
    if (userRole !== 'ADMIN' && restaurant.country !== userCountry) {
      throw new ForbiddenException(
        'Cannot order from restaurants outside your country'
      )
    }

    return await this.prisma.order.create({
      data: {
        userId,
        restaurantId: input.restaurantId,
        deliveryAddress: input.deliveryAddress,
        status: 'DRAFT',
        totalAmount: 0,
      },
      include: {
        orderItems: true,
      },
    })
  }

  async addOrderItem(userId: string, input: AddOrderItemInput) {
    // Verify order exists and belongs to user
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    if (order.status !== 'DRAFT') {
      throw new BadRequestException('Can only add items to draft orders')
    }

    // Verify menu item exists and belongs to the same restaurant
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: input.menuItemId },
    })

    if (!menuItem) {
      throw new NotFoundException('Menu item not found')
    }

    if (menuItem.restaurantId !== order.restaurantId) {
      throw new BadRequestException(
        'Menu item does not belong to this restaurant'
      )
    }

    if (!menuItem.isAvailable) {
      throw new BadRequestException('Menu item is not available')
    }

    // Check if item already exists in order
    const existingItem = await this.prisma.orderItem.findFirst({
      where: {
        orderId: input.orderId,
        menuItemId: input.menuItemId,
      },
    })

    let orderItem
    if (existingItem) {
      // Update quantity
      orderItem = await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + input.quantity,
        },
      })
    } else {
      // Create new order item
      orderItem = await this.prisma.orderItem.create({
        data: {
          orderId: input.orderId,
          menuItemId: input.menuItemId,
          quantity: input.quantity,
          priceAtOrder: menuItem.price,
        },
      })
    }

    // Update order total
    await this.updateOrderTotal(input.orderId)

    return orderItem
  }

  async updateOrderItem(userId: string, input: UpdateOrderItemInput) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: input.orderItemId },
      include: { order: true },
    })

    if (!orderItem) {
      throw new NotFoundException('Order item not found')
    }

    if (orderItem.order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    if (orderItem.order.status !== 'DRAFT') {
      throw new BadRequestException('Can only update items in draft orders')
    }

    const updatedItem = await this.prisma.orderItem.update({
      where: { id: input.orderItemId },
      data: { quantity: input.quantity },
    })

    // Update order total
    await this.updateOrderTotal(orderItem.orderId)

    return updatedItem
  }

  async removeOrderItem(userId: string, orderItemId: string): Promise<boolean> {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true },
    })

    if (!orderItem) {
      throw new NotFoundException('Order item not found')
    }

    if (orderItem.order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    if (orderItem.order.status !== 'DRAFT') {
      throw new BadRequestException('Can only remove items from draft orders')
    }

    await this.prisma.orderItem.delete({
      where: { id: orderItemId },
    })

    // Update order total
    await this.updateOrderTotal(orderItem.orderId)

    return true
  }

  async checkout(userId: string, input: CheckoutInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
      include: { orderItems: true },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    if (order.status !== 'DRAFT') {
      throw new BadRequestException('Can only checkout draft orders')
    }

    if (order.orderItems.length === 0) {
      throw new BadRequestException('Cannot checkout empty order')
    }

    // Verify payment method exists
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: input.paymentMethodId },
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    return await this.prisma.order.update({
      where: { id: input.orderId },
      data: {
        status: 'PENDING',
        paymentMethodId: input.paymentMethodId,
        deliveryAddress: input.deliveryAddress || order.deliveryAddress,
        paidAt: new Date(),
      },
      include: {
        orderItems: true,
        paymentMethod: true,
      },
    })
  }

  async cancelOrder(userId: string, userRole: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    // Only owner or admin can cancel
    if (userRole !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order')
    }

    // Cannot cancel confirmed or delivered orders
    if (order.status === 'CONFIRMED' || order.status === 'DELIVERED') {
      throw new BadRequestException(
        'Cannot cancel confirmed or delivered orders'
      )
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
      include: {
        orderItems: true,
      },
    })
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    const updateData: any = { status }

    // Set timestamps based on status
    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date()
    } else if (status === 'DELIVERED') {
      updateData.paidAt = updateData.paidAt || new Date()
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
    })
  }

  async adminProcessPayment(orderId: string, paymentMethodId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status !== 'DRAFT' && order.status !== 'PENDING') {
      throw new BadRequestException('Can only process payment for draft or pending orders')
    }

    // Verify payment method exists
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentMethodId: paymentMethodId,
        paidAt: new Date(),
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: true,
        paymentMethod: true,
      },
    })
  }

  private async updateOrderTotal(orderId: string) {
    const orderItems = await this.prisma.orderItem.findMany({
      where: { orderId },
    })

    const totalAmount = orderItems.reduce(
      (sum: number, item: { priceAtOrder: number; quantity: number }) =>
        sum + item.priceAtOrder * item.quantity,
      0
    )

    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount },
    })
  }
}
