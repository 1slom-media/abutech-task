import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import * as fs from 'fs/promises';
import { UsersEntity } from './users.entity';
import { CreateUserDto } from './dtos/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private repo: Repository<UsersEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  findEmail(email: string) {
    if (!email) {
      return null;
    }
    return this.repo.findOneBy({ email });
  }

  createUsers(data: CreateUserDto) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async updateProfile(userId: number, attrs: Partial<UsersEntity>) {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async searchUsers(fullname: string) {
    const users = await this.repo.find({
      where: {
        fullname: Like(`%${fullname}%`),
      },
    });
    return users;
  }
}
