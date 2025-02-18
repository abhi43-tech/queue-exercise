import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { MailQueueService } from 'src/mail-sender/mail.queue.service';
import { MailService } from 'src/mail-sender/mail.service';

@Controller('user')
export class UserController {
  private userName: string;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailQueueService: MailQueueService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @Request() req,
    @Response() res,
    @Body('user') user,
    @Body('password') password,
  ) {
    const { access_token } = await this.authService.login(user);
    this.userName = user;
    console.log(user);

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 60000,
    });
    res.json({ access_token });
  }

  @UseGuards(JwtGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @Put('subscribe')
  async update(@Body('subscribe') subscribe: string[]) {
    return this.userService.updateUser(subscribe, this.userName);
  }

  @Get('send-email')
  async sendEmail(@Body('email') email: string) {
    await this.mailQueueService.addEmailJob(email);
    return 'Email sent';
  }
}
