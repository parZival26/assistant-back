import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: createEventDto
    })
  }

  async findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.event.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: { id },
      data: updateEventDto
    })
  }

  async remove(id: number) {
    return this.prismaService.event.delete({
      where: { id }
    })
  }

  async findUserEvents(userId: number) {
    console.log(userId);
    
    return this.prismaService.event.findMany({
      where: {
        EventUser: {
          some: {
            userId
          }
        }
      }
    });
  }
}
