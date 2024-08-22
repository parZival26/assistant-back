import {Injectable, UnauthorizedException, CanActivate } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";




@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin'){
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: { username: string }): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { username: payload.username }
        });

        
        if (!user || !user.isAdmin) {
            throw new UnauthorizedException();
        }
        
        return user;
    }


}

