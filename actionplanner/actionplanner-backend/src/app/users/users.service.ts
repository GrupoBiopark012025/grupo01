import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await this.userRepository.getEntityManager().persistAndFlush(user);

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }

    const { email, password, firstName, lastName } = updateUserDto;

    if (email) user.email = email;
    if (password) user.password = await hash(password, 8);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await this.userRepository.getEntityManager().flush();
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
