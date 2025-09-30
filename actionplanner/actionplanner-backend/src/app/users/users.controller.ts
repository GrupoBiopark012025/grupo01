import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dtos/user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { ApiPaginatedResponse } from '@shared/decorators/paginated-response.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query() getUserDto: GetUserDto
  ): Promise<PaginationResponseDto<UserDto>> {
    return this.usersService.findAll(getUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<string> {
    return this.usersService.remove(id);
  }
}
