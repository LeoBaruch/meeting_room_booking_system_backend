import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get('send')
  async send(@Query('email') email: string) {
    await this.emailService.send({
      to: email,
      name: '会议室预订系统',
      subject: '会议室预订系统验证码',
      html: '您的验证码是: XXX',
    });
    return 'ok';
  }
}
