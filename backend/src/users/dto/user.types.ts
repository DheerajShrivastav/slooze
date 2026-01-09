import { InputType, Field } from '@nestjs/graphql'
import { IsEnum, IsUUID } from 'class-validator'
import { Role, Country } from '../../auth/dto/auth.types'

@InputType()
export class UpdateUserRoleInput {
  @Field()
  @IsUUID()
  userId: string

  @Field(() => Role)
  @IsEnum(Role)
  role: Role
}

@InputType()
export class UpdateUserCountryInput {
  @Field()
  @IsUUID()
  userId: string

  @Field(() => Country)
  @IsEnum(Country)
  country: Country
}
