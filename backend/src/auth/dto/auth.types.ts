import { ObjectType, Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator'
import { Role as PrismaRole, Country as PrismaCountry } from '@prisma/client'

// Re-export Prisma enums
export const Role = PrismaRole
export type Role = PrismaRole

export const Country = PrismaCountry
export type Country = PrismaCountry

registerEnumType(PrismaRole, { name: 'Role' })
registerEnumType(PrismaCountry, { name: 'Country' })

// User Type
@ObjectType()
export class UserType {
  @Field()
  id: string

  @Field()
  email: string

  @Field()
  name: string

  @Field(() => PrismaRole)
  role: PrismaRole

  @Field(() => PrismaCountry)
  country: PrismaCountry

  @Field()
  createdAt?: Date

  @Field()
  updatedAt?: Date
}

// Auth Payload
@ObjectType()
export class AuthPayload {
  @Field()
  token: string

  @Field(() => UserType)
  user: UserType
}

// Register Input
@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @MinLength(8)
  password: string

  @Field()
  @IsNotEmpty()
  name: string

  @Field(() => PrismaCountry)
  @IsEnum(PrismaCountry)
  country: PrismaCountry
}

// Login Input
@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  password: string
}
