import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey',
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { permissions: true }
        });

        if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
            throw new UnauthorizedException('Usuario bloqueado o inactivo');
        }

        // Normalize Role to UPPERCASE once here to avoid duplication in controllers
        const role = (user.permissions?.name || user.role || 'USER').toUpperCase();

        return {
            ...user,
            id: payload.sub,
            userId: payload.sub, // compatibility
            email: payload.email,
            role: role,
            isAdmin: role === 'ADMIN' || role.includes('ADMIN'),
            permissions: user.permissions?.list || [],
        };
    }
}
