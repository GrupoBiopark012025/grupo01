import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { hash } from 'bcryptjs';
import { UserDto } from './dtos/user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, password, firstName, lastName } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await this.userRepository.getEntityManager().persistAndFlush(user);

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    const { email, password, firstName, lastName } = updateUserDto;

    if (email) user.email = email;
    if (password) user.password = await hash(password, 8);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await this.userRepository.getEntityManager().flush();

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  async remove(id: string): Promise<string> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    const em = this.userRepository.getEntityManager();

    em.remove(user);
    await em.flush();

    return 'Usuário removido com sucesso!';
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  async findAll(getUserDto: GetUserDto): Promise<PaginationResponseDto<UserDto>> {
    const { page, pageSize } = getUserDto;

    const users = await this.userRepository.findAll({
      orderBy: { createdAt: 'DESC' },
      offset: (page - 1) * pageSize,
      limit: getUserDto.pageSize
    });

    const recordsTotal = await this.userRepository.count();

    return {
      pageSize,
      recordsTotal,
      list: users.map(user => ({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    };
  }
}
