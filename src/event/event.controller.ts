import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ValidationPipe, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Request } from 'express';
import { JwtAdminAuthGuard, JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  async create(@Body(new ValidationPipe()) createEventDto: CreateEventDto) {
    return await this.eventService.create(createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.eventService.findAll();
  }

  @Get('userEvents/')
  @UseGuards(JwtAuthGuard)
  async findUserEvents(@Req() req: Request) {
    const userId = Number(req.user['id']);
    console.log(userId);
    
    return await this.eventService.findUserEvents(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Validation failed. Parameter is not a number.');
    }
    return await this.eventService.findOne(idNumber);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateEventDto: UpdateEventDto) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Validation failed. Parameter is not a number.');
    }
    return await this.eventService.update(idNumber, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  async remove(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Validation failed. Parameter is not a number.');
    }
    return await this.eventService.remove(idNumber);
  }

  

}
