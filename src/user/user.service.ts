import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prismaService.user.findFirst({
      where: {
          username: createUserDto.username
      }
    });

    if (existing) {
        throw new ConflictException('Username or email already exists');
    }

    return this.prismaService.user.create({ data: { username: createUserDto.username, password: encodePassword(createUserDto.password), email:createUserDto.email  } });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
          id: id
      }
  });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
