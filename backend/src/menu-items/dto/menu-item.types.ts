import { ObjectType, Field, InputType, Float } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator'

@ObjectType()
export class MenuItemType {
  @Field()
  id: string

  @Field()
  restaurantId: string

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => Float)
  price: number

  @Field()
  imageUrl: string

  @Field()
  category: string

  @Field()
  isAvailable: boolean

  @Field()
  isVegetarian: boolean

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
export class CreateMenuItemInput {
  @Field()
  @IsNotEmpty()
  restaurantId: string

  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  description: string

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number

  @Field()
  @IsNotEmpty()
  imageUrl: string

  @Field()
  @IsNotEmpty()
  category: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean
}

@InputType()
export class UpdateMenuItemInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  description?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  imageUrl?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  category?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean
}
