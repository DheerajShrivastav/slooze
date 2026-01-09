import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CountryGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const { user } = ctx.getContext().req;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Admin can access all countries
        if (user.role === 'ADMIN') {
            return true;
        }

        // Store user country in context for filtering
        ctx.getContext().userCountry = user.country;

        return true;
    }
}
