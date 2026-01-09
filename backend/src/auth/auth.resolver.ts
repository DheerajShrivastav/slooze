import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
    AuthPayload,
    RegisterInput,
    LoginInput,
    UserType
} from './dto/auth.types';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => AuthPayload)
    async register(@Args('input') registerInput: RegisterInput): Promise<AuthPayload> {
        return await this.authService.register(registerInput);
    }

    @Mutation(() => AuthPayload)
    async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
        return await this.authService.login(loginInput);
    }

    @Query(() => UserType)
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: any): Promise<UserType> {
        return await this.authService.validateUser(user.id);
    }
}
