import {
  ObjectType,
  Field,
  InputType,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator'
import { OrderStatus as PrismaOrderStatus } from '@prisma/client'
import { MenuItemType } from '../../menu-items/dto/menu-item.types'
import { UserType } from '../../auth/dto/auth.types'
import { RestaurantType } from '../../restaurants/dto/restaurant.types'
import { PaymentMethodObjectType } from '../../payment-methods/dto/payment-method.types'

// Re-export Prisma enum
export const OrderStatus = PrismaOrderStatus
export type OrderStatus = PrismaOrderStatus

registerEnumType(PrismaOrderStatus, { name: 'OrderStatus' })

@ObjectType()
export class OrderItemType {
  @Field()
  id: string

  @Field()
  orderId: string

  @Field()
  menuItemId: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  priceAtOrder: number

  @Field(() => MenuItemType, { nullable: true })
  menuItem?: MenuItemType

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class OrderType {
  @Field()
  id: string

  @Field()
  userId: string

  @Field()
  restaurantId: string

  @Field(() => PrismaOrderStatus)
  status: PrismaOrderStatus

  @Field(() => Float)
  totalAmount: number

  @Field(() => String, { nullable: true })
  deliveryAddress?: string | null

  @Field(() => String, { nullable: true })
  paymentMethodId?: string | null

  @Field(() => Date, { nullable: true })
  paidAt?: Date | null

  @Field(() => Date, { nullable: true })
  cancelledAt?: Date | null

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [OrderItemType], { nullable: true })
  orderItems?: OrderItemType[]

  @Field(() => UserType, { nullable: true })
  user?: UserType

  @Field(() => RestaurantType, { nullable: true })
  restaurant?: RestaurantType

  @Field(() => PaymentMethodObjectType, { nullable: true })
  paymentMethod?: PaymentMethodObjectType | null
}

@InputType()
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  restaurantId: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  deliveryAddress?: string
}

@InputType()
export class AddOrderItemInput {
  @Field()
  @IsUUID()
  orderId: string

  @Field()
  @IsUUID()
  menuItemId: string

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number
}

@InputType()
export class UpdateOrderItemInput {
  @Field()
  @IsUUID()
  orderItemId: string

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number
}

@InputType()
export class CheckoutInput {
  @Field()
  @IsUUID()
  orderId: string

  @Field()
  @IsUUID()
  paymentMethodId: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  deliveryAddress?: string
}

@InputType()
export class OrdersFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  restaurantId?: string

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus
}

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  @IsUUID()
  orderId: string

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus
}

@InputType()
export class AdminProcessPaymentInput {
  @Field()
  @IsUUID()
  orderId: string

  @Field()
  @IsUUID()
  paymentMethodId: string
}
