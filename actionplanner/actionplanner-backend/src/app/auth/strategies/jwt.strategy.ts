import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadDto } from '../dtos/token-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const publicKey = configService.get<string>('JWT_PUBLIC_KEY')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64')
    });
  }

  async validate(payload: TokenPayloadDto) {
    return { userId: payload.sub, email: payload.email };
  }
}
