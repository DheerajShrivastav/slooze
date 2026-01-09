import {
  ObjectType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsEnum,
  Length,
} from 'class-validator'
import { PaymentType } from '@prisma/client'

// Re-export Prisma enum with a more descriptive name
export const PaymentMethodType = PaymentType
export type PaymentMethodType = PaymentType

registerEnumType(PaymentType, { name: 'PaymentMethodType' })

@ObjectType()
export class PaymentMethodObjectType {
  @Field()
  id: string

  @Field(() => String, { nullable: true })
  userId?: string | null

  @Field(() => PaymentType)
  type: PaymentType

  @Field()
  provider: string

  @Field()
  last4Digits: string

  @Field(() => Int)
  expiryMonth: number

  @Field(() => Int)
  expiryYear: number

  @Field()
  isDefault: boolean

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
export class AddPaymentMethodInput {
  @Field(() => PaymentType)
  @IsEnum(PaymentType)
  type: PaymentType

  @Field()
  @IsNotEmpty()
  provider: string

  @Field()
  @IsNotEmpty()
  @Length(4, 4)
  last4Digits: string

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth: number

  @Field(() => Int)
  @IsNumber()
  @Min(2024)
  expiryYear: number

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => PaymentType, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  provider?: string

  @Field({ nullable: true })
  @IsOptional()
  @Length(4, 4)
  last4Digits?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(2024)
  expiryYear?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
