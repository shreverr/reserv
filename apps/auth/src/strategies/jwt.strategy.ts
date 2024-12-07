import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId })
  }
}