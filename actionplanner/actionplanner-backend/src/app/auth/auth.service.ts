import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type SignInData = { userId: string, email: string }

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: LoginRequestDto): Promise<SignInData | null> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (compareSync(input.password, user.password)) {
      return { userId: user.id, email: user.email };
    }

    return null;
  }

  async signIn(input: SignInData): Promise<LoginResponseDto> {
    const tokenPayload = {
      sub: input.userId,
      email: input.email
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { userId: input.userId, email: input.email, accessToken: accessToken };
  }
}
