import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { AssistanceModule } from './assistance/assistance.module';

@Module({
  imports: [AuthModule, UserModule, EventModule, AssistanceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
