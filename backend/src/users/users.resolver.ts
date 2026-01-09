import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { UserType, Role, Country } from '../auth/dto/auth.types'

@Resolver(() => UserType)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserType)
  async me(@CurrentUser() user: any): Promise<UserType> {
    return await this.usersService.findOne(user.id)
  }

  @Query(() => [UserType])
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async users(
    @Args('role', { type: () => Role, nullable: true }) role: Role,
    @Args('country', { type: () => Country, nullable: true }) country: Country
  ): Promise<UserType[]> {
    return await this.usersService.findAll({ role, country })
  }

  @Query(() => UserType, { nullable: true })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async user(@Args('id') id: string): Promise<UserType> {
    return await this.usersService.findOne(id)
  }

  @Mutation(() => UserType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(
    @Args('userId') userId: string,
    @Args('role', { type: () => Role }) role: Role
  ): Promise<UserType> {
    return await this.usersService.updateRole(userId, role)
  }

  @Mutation(() => UserType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateUserCountry(
    @Args('userId') userId: string,
    @Args('country', { type: () => Country }) country: Country
  ): Promise<UserType> {
    return await this.usersService.updateCountry(userId, country)
  }
}
