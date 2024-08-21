import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddUsersToEventDto } from './dto/addUsersToEvent.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as qrcode from 'qrcode';
import { encodePassword } from 'src/utils/bcrypt';


@Injectable()
export class AssistanceService {

  constructor(private readonly prismaService: PrismaService) {}

  async addUserToEvent(addUsersToEventDto: AddUsersToEventDto) {
    try {

      
  
        // Crea la relación entre el usuario y el evento
      await this.prismaService.eventUser.create({
        data: {
            userId: addUsersToEventDto.user,
            eventId: addUsersToEventDto.event,
          },
        });
      
      return { message: 'User added to event' };
        
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new UnprocessableEntityException('User does not exist');
        }
      }

      console.log(error);
      
      throw InternalServerErrorException;
    }
  }

  async assistanceByEvent(eventId: number) {
    try {
      return this.prismaService.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          description: true,
          initialDate: true,
          finalDate: true,
          speaker: true,
          location: true,
          status: true,
          EventUser: {
            select: {
              User: {
                select: {
                  id: true,
                  username: true,
                  email: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async generateAssistanceQRCode(eventId: number, userId: number) {
    try {
      const event = await this.prismaService.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          description: true,
          initialDate: true,
          finalDate: true,
          speaker: true,
          location: true,
          status: true,
        }
      });

      if (!event) {
        throw new UnprocessableEntityException('Event does not exist');
      }

      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      if (!user) {
        throw new UnprocessableEntityException('User does not exist');
      }

      const deadLineCode = event.finalDate.getHours() + 1;
      const hashCode = encodePassword(`${userId}-${eventId}-${deadLineCode}`);
      const qr = await qrcode.toDataURL(hashCode);

      return qr;


      
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


}
