import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
            signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
