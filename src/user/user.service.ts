import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { RedisService } from '@/redis/redis.service';
import { md5 } from '@/utils';
import { EmailService } from '@/email/email.service';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;
  @Inject(RedisService)
  private redisService: RedisService;
  @Inject(EmailService)
  private emailService: EmailService;

  async register(user: RegisterUserDto) {
    console.log('userdto', user);
    const captcha = await this.redisService.get(
      `captcha_register_${user.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    console.log('newUser aaaaddd');
    try {
      console.log('res aaaaddd');
      await this.userRepository.save(newUser);

      return '成功';
    } catch (error) {
      this.logger.error(error, UserService);
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    }
  }

  async sendRegisterCaptcha(email: string) {
    const redisKey = `captcha_register_${email}`;
    const captcha = Math.random().toString().slice(2, 6);
    const captchaCached = await this.redisService.get(redisKey);
    console.log('captchaCached', captchaCached);
    if (captchaCached) {
      return {
        message: '验证码已发送，请勿重复发送!',
      };
    }
    await this.redisService.set(redisKey, captcha, 5 * 60);
    await this.emailService.send({
      to: email,
      name: '会议室管理系统-注册用户',
      subject: '注册验证码',
      html: `<h3>您的注册验证码为：${captcha}</h3>`,
    });

    return 'ok';
  }
}
