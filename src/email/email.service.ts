import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('email'),
        pass: this.configService.get('mail_password'),
      },
    });
  }

  async send({ to, name, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: name,
        address: this.configService.get('email'),
      },
      to,
      subject,
      html,
    });
  }
}
