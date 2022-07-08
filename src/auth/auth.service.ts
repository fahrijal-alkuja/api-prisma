import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }
    
    hashData(password: string) {
        return bcrypt.hash(password, 10);
    }
    async signup(dto: AuthDto) {
        const { name, email, password, rules } = dto;
        const hashedPassword = await this.hashData(password);
        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                rules
            },
        });
    }
    signinWithJwt(user: any) { 
        const payload = { email: user.email, sub: user.id, rules: user.rules };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async signin(dto: LoginDto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid password');
        }
        return this.signinWithJwt(user);
    }
    signout(){}
    refreshToken(){}
}
