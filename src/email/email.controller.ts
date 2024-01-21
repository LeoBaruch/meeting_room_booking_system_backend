import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get('send')
  async send(@Query('email') email: string) {
    // 生成六位数验证码
    const captcha = Math.random().toString().slice(2, 8);
    await this.emailService.send({
      to: email,
      name: '会议室预订系统',
      subject: '会议室预订系统验证码',
      html: '您的验证码是: ' + captcha,
    });
    return 'ok';
  }
}
