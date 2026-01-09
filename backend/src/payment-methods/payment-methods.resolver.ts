import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PaymentMethodsService } from './payment-methods.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import {
  PaymentMethodObjectType,
  AddPaymentMethodInput,
  UpdatePaymentMethodInput,
} from './dto/payment-method.types'

@Resolver(() => PaymentMethodObjectType)
@UseGuards(JwtAuthGuard)
export class PaymentMethodsResolver {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Query(() => [PaymentMethodObjectType])
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async paymentMethods(): Promise<PaymentMethodObjectType[]> {
    return await this.paymentMethodsService.findAll()
  }

  @Query(() => [PaymentMethodObjectType])
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async availablePaymentMethods(): Promise<PaymentMethodObjectType[]> {
    return await this.paymentMethodsService.findAvailable()
  }

  @Query(() => PaymentMethodObjectType, { nullable: true })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async paymentMethod(
    @Args('id') id: string
  ): Promise<PaymentMethodObjectType> {
    return await this.paymentMethodsService.findOne(id)
  }

  @Mutation(() => PaymentMethodObjectType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async addPaymentMethod(
    @Args('input') input: AddPaymentMethodInput
  ): Promise<PaymentMethodObjectType> {
    return await this.paymentMethodsService.create(input)
  }

  @Mutation(() => PaymentMethodObjectType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('input') input: UpdatePaymentMethodInput
  ): Promise<PaymentMethodObjectType> {
    return await this.paymentMethodsService.update(id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async deletePaymentMethod(@Args('id') id: string): Promise<boolean> {
    return await this.paymentMethodsService.delete(id)
  }
}
