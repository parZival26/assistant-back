import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { AddUsersToEventDto } from './dto/addUsersToEvent.dto';
import { JwtAdminAuthGuard, JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ValidateQrDto } from './dto/validateQr.dto';



@Controller('assistance')
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) {}

  @Post("/addUserToEvent")
  @UseGuards(JwtAdminAuthGuard)
  async addUserToEvent(@Body(new ValidationPipe()) addUsersToEventDto: AddUsersToEventDto) {
    return await this.assistanceService.addUserToEvent(addUsersToEventDto);
  }

  @Get("/assistanceByEvent/:eventId")
  @UseGuards(JwtAdminAuthGuard)
  async assistanceByEvent(@Param('eventId') eventId: number) {
    const eventIdNumber = Number(eventId);    
    if (isNaN(eventIdNumber)) {
      throw new BadRequestException('Validation failed. Parameter is not a number.');
    }
    return await this.assistanceService.assistanceByEvent(eventIdNumber);
  }

  @Get("/generateQR/:eventId")
  @UseGuards(JwtAuthGuard)
  async generateQR(@Param('eventId') eventId: number, @Req() req: Request) {
    const eventIdNumber = Number(eventId);    
    if (isNaN(eventIdNumber)) {
      throw new BadRequestException('Validation failed. Parameter is not a number.');
    }
    
    const userId = Number(req.user['id']);

    const qrCodeDataURL = await this.assistanceService.generateAssistanceQRCode(eventIdNumber, userId);

    //transform qr
    return { qrCodeDataURL };
  

  }

  @Post("/validateQRCode")
  @UseGuards(JwtAdminAuthGuard)
  async validateQRCode(@Body(new ValidationPipe()) body: ValidateQrDto) {
    return await this.assistanceService.validateQRCode(body.qrCode);
  }

}
