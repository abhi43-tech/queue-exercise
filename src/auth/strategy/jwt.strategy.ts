import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.Access; 
        }
      ]),  
      ignoreExpiration: false,
      secretOrKey: "ACCESS_SECRET",
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role
    }
  }
}