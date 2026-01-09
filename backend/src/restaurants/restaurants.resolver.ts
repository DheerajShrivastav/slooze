import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RestaurantType } from './dto/restaurant.types';

@Resolver(() => RestaurantType)
@UseGuards(JwtAuthGuard)
export class RestaurantsResolver {
    constructor(private restaurantsService: RestaurantsService) { }

    @Query(() => [RestaurantType])
    async restaurants(@CurrentUser() user: any): Promise<RestaurantType[]> {
        return await this.restaurantsService.findAll(user.role, user.country);
    }

    @Query(() => RestaurantType)
    async restaurant(
        @Args('id') id: string,
        @CurrentUser() user: any,
    ): Promise<RestaurantType> {
        return await this.restaurantsService.findOne(id, user.role, user.country);
    }
}
