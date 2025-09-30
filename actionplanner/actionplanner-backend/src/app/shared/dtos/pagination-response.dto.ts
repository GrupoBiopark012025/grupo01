import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  pageSize: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  recordsTotal: number;

  @IsArray()
  @IsNotEmpty()
  list: T[]
}
