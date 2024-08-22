import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Prisma } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: { username: string }): Promise<Prisma.UserCreateInput> {
        if (!payload.username) {
            throw new UnauthorizedException('Invalid Token');
        }
        const users = await this.prismaService.user.findUnique({
            where: {
                username: payload.username
            }
        })
        return users;
    }
}