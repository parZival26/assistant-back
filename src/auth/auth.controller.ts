import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto:LoginDto) {
    return await this.authService.login(loginDto)
  }

  @Post('/register')
  async register(@Body(new ValidationPipe()) registerDto:CreateUserDto){
    return await this.authService.register(registerDto)
  }

}
