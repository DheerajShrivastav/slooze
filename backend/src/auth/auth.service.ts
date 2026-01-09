import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerInput: {
    email: string
    password: string
    name: string
    country: string
  }) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerInput.password, 10)

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerInput.email,
        password: hashedPassword,
        name: registerInput.name,
        country: registerInput.country as any,
        role: 'MEMBER', // Default role
      },
    })

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
      },
    }
  }

  async login(loginInput: { email: string; password: string }) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
      },
    }
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role }
    return this.jwtService.sign(payload)
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return user
  }
}
