import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService 
    ) {}

    async login(loginDto: LoginDto): Promise<{accessToken: string}> {
        const { username, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new NotFoundException('Invalid password');
        }

        const payload = { username };

        const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN });

        return {accessToken: accessToken};
    }

    async register(registerDto: CreateUserDto): Promise<string> {
        await this.userService.create(registerDto);
        return "Succesfully registered"
    }
}
