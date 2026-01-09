import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { MenuItemsService } from './menu-items.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  MenuItemType,
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from './dto/menu-item.types'

@Resolver(() => MenuItemType)
@UseGuards(JwtAuthGuard)
export class MenuItemsResolver {
  constructor(private menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItemType])
  async menuItems(
    @Args('restaurantId') restaurantId: string,
    @Args('category', { nullable: true }) category: string,
    @Args('isAvailable', { nullable: true, defaultValue: true })
    isAvailable: boolean,
    @Args('isVegetarian', { nullable: true }) isVegetarian: boolean,
    @CurrentUser() user: any
  ): Promise<MenuItemType[]> {
    return await this.menuItemsService.findAll(
      restaurantId,
      user.role,
      user.country,
      { category, isAvailable, isVegetarian }
    )
  }

  @Query(() => MenuItemType, { nullable: true })
  async menuItem(
    @Args('id') id: string,
    @CurrentUser() user: any
  ): Promise<MenuItemType> {
    return await this.menuItemsService.findOne(id, user.role, user.country)
  }

  @Mutation(() => MenuItemType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async createMenuItem(
    @Args('input') input: CreateMenuItemInput
  ): Promise<MenuItemType> {
    return await this.menuItemsService.create(input)
  }

  @Mutation(() => MenuItemType)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateMenuItem(
    @Args('id') id: string,
    @Args('input') input: UpdateMenuItemInput
  ): Promise<MenuItemType> {
    return await this.menuItemsService.update(id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async deleteMenuItem(@Args('id') id: string): Promise<boolean> {
    return await this.menuItemsService.delete(id)
  }
}
