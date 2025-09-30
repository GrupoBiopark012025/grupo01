import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
