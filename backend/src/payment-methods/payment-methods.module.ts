import { Module } from '@nestjs/common'
import { PaymentMethodsResolver } from './payment-methods.resolver'
import { PaymentMethodsService } from './payment-methods.service'

@Module({
  providers: [PaymentMethodsResolver, PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
