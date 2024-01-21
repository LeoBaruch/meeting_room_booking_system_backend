import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { CaptchaDto } from './dto/captcha.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    this.userService.register(registerUser);
    return 'ok';
  }

  @Post('register/captcha')
  async registerCaptcha(@Body() { email }: CaptchaDto) {
    const response = this.userService.sendRegisterCaptcha(email);
    return response;
  }
}
