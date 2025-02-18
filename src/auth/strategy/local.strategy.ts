import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        usernameField: 'user',
        passwordField: 'password'
      }
    );
  }

  async validate(username, password) {
    const user = await this.authService.validateUser(username, password);

    if(!user) throw new UnauthorizedException('User not found with given data.');

    return user
  }
}