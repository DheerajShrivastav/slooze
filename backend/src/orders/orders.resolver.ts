import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  OrderType,
  OrderItemType,
  OrderStatus,
  CreateOrderInput,
  AddOrderItemInput,
  UpdateOrderItemInput,
  CheckoutInput,
} from './dto/order.types'

@Resolver(() => OrderType)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [OrderType])
  async myOrders(
    @CurrentUser() user: any,
    @Args('status', { type: () => OrderStatus, nullable: true })
    status: OrderStatus,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number
  ): Promise<OrderType[]> {
    return await this.ordersService.findMyOrders(user.id, {
      status,
      limit,
      offset,
    })
  }

  @Query(() => OrderType, { nullable: true })
  async order(
    @Args('id') id: string,
    @CurrentUser() user: any
  ): Promise<OrderType> {
    return await this.ordersService.findOne(id, user.id, user.role)
  }

  @Query(() => [OrderType])
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async orders(
    @Args('userId', { nullable: true }) userId: string,
    @Args('restaurantId', { nullable: true }) restaurantId: string,
    @Args('status', { type: () => OrderStatus, nullable: true })
    status: OrderStatus,
    @Args('country', { nullable: true }) country: string
  ): Promise<OrderType[]> {
    return await this.ordersService.findAll({
      userId,
      restaurantId,
      status,
      country,
    })
  }

  @Mutation(() => OrderType)
  async createOrder(
    @CurrentUser() user: any,
    @Args('input') input: CreateOrderInput
  ): Promise<OrderType> {
    return await this.ordersService.create(
      user.id,
      user.role,
      user.country,
      input
    )
  }

  @Mutation(() => OrderItemType)
  async addOrderItem(
    @CurrentUser() user: any,
    @Args('input') input: AddOrderItemInput
  ): Promise<OrderItemType> {
    return await this.ordersService.addOrderItem(user.id, input)
  }

  @Mutation(() => OrderItemType)
  async updateOrderItem(
    @CurrentUser() user: any,
    @Args('input') input: UpdateOrderItemInput
  ): Promise<OrderItemType> {
    return await this.ordersService.updateOrderItem(user.id, input)
  }

  @Mutation(() => Boolean)
  async removeOrderItem(
    @CurrentUser() user: any,
    @Args('id') id: string
  ): Promise<boolean> {
    return await this.ordersService.removeOrderItem(user.id, id)
  }

  @Mutation(() => OrderType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async checkout(
    @CurrentUser() user: any,
    @Args('input') input: CheckoutInput
  ): Promise<OrderType> {
    return await this.ordersService.checkout(user.id, input)
  }

  @Mutation(() => OrderType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async cancelOrder(
    @CurrentUser() user: any,
    @Args('orderId') orderId: string
  ): Promise<OrderType> {
    return await this.ordersService.cancelOrder(user.id, user.role, orderId)
  }
}
