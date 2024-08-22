import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddUsersToEventDto } from './dto/addUsersToEvent.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as qrcode from 'qrcode';
import { encodePassword } from 'src/utils/bcrypt';
import * as bcrypt from 'bcrypt';
import { decrypt, encrypt } from 'src/utils/crypto';

@Injectable()
export class AssistanceService {

  constructor(private readonly prismaService: PrismaService) {}

  async addUserToEvent(addUsersToEventDto: AddUsersToEventDto) {
    try {

      const unexistingUsers = [];
      const userAlredyRegistered = [];

      for (const user of addUsersToEventDto.users) {
        const userExist = await this.prismaService.user.findUnique({
          where: { id: user },
          select: {
            id: true,
            username: true,
            email: true
          }
        });

        if (!userExist) {
          unexistingUsers.push(user);
          continue;
        }

        const userRegistered = await this.prismaService.eventUser.findUnique({
          where: {
            userId_eventId: {
              userId: user,
              eventId: addUsersToEventDto.event
            }
          }
        });

        if (userRegistered) {
          userAlredyRegistered.push(user);
          continue;
        }

        await this.prismaService.eventUser.create({
          data: {
            userId: user,
            eventId: addUsersToEventDto.event
          }
        });
      }

      return { message: `Users added to event`, unexistingUsers, userAlredyRegistered };
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
          EventUser: {
            select: {
              User: {
                select: {
                  id: true,
                  username: true,
                  email: true
                }
              },
              status: true
            }
          }
        }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async assistanceByUser(userId: number) {
    try {
      return this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          EventUser: {
            select: {
              Event: {
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

      const EventUser = await this.prismaService.eventUser.findUnique({
        where: {
          userId_eventId: {
            eventId,
            userId
          }
        }
      });

      if (!EventUser) {
        throw new UnprocessableEntityException('User is not registered in the event');
      }

      const deadLineCode = event.finalDate.getHours() + 1;
      const hashCode = encrypt(`${userId}-${eventId}-${deadLineCode}`);
      const qr = await qrcode.toDataURL(hashCode);

      return qr;
  }


  async validateQRCode(hashCode: string) {
      let decrypted: string;
      try {
        decrypted = decrypt(hashCode);
        
      } catch (error) {
        throw new UnprocessableEntityException('Invalid QR Code');
      }

      const [userId, eventId, deadLineCode] = decrypted.split('-');
      

      if (!userId || !eventId || !deadLineCode) {
        throw new UnprocessableEntityException('Invalid QR Code');
      }

      const user = await this.prismaService.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      if (!user) {
        throw new UnprocessableEntityException('User does not exist');
      }

      const event = await this.prismaService.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!event) {
        throw new UnprocessableEntityException('Event does not exist');
      }

      const currentDate = new Date();
      const deadLineDate = new Date(event.finalDate);
      deadLineDate.setHours(deadLineDate.getHours() + 1);

      if (currentDate > deadLineDate) {
        throw new UnprocessableEntityException('QR Code expired');
      }

      await this.prismaService.eventUser.update({
        where: {
          userId_eventId: {
            eventId: Number(eventId),
            userId: Number(userId)
          }
        },
        data: {
          status: "assisted"
        }
      });
      
      return { message: 'User assisted' };

  }


}
