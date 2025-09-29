import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { compareSync } from 'bcryptjs';

type SignInData = { userId: string, email: string }

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async authenticate(input: LoginRequestDto): Promise<LoginResponseDto | null> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      token: 'token',
      userId: user.userId,
      email: user.email
    }
  }

  async validateUser(input: LoginRequestDto): Promise<SignInData | null> {
    const user = await this.usersService.findByEmail(input.email);

    if (user && compareSync(input.password, user.password)) {
      return { userId: user.id, email: user.email };
    }

    return null;
  }
}
