import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationRequestDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number (default: 1)', example: 1 })
  page: number = 1;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Items per page (default: 20)', example: 20 })
  pageSize: number = 20;
}
