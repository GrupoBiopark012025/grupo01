import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
