import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { Country } from '../../auth/dto/auth.types'

@ObjectType()
export class RestaurantType {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  description: string

  @Field()
  imageUrl: string

  @Field(() => Country)
  country: Country

  @Field()
  cuisine: string

  @Field()
  rating: number

  @Field()
  deliveryTime: string

  @Field()
  isActive: boolean

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
