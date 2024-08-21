import { Module } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { AssistanceController } from './assistance.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AssistanceController],
  providers: [AssistanceService, PrismaService],
})
export class AssistanceModule {}
