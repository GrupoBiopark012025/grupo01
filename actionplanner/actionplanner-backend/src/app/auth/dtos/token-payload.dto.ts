import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TokenPayloadDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
