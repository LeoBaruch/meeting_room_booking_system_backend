import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService, ConfigService],
  exports: [EmailService],
})
export class EmailModule {}
