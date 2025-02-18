import { Injectable, Proppatch, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);

    if (!user)
      throw new UnauthorizedException('User not found with given data.');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Password is wrong.');

    const { password: _, ...rest } = user;
    return rest;
  }

  async login(user: string) {
    const payload = { username: user };
    const access_token = this.jwtService.sign(payload, {
      secret: 'ACCESS_SECRET',
      expiresIn: '1m',
    });

    return { access_token };
  }
}
