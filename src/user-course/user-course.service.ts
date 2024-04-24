import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCourseDto, UserCourseDto } from './dtos/user-course';
import { UsersEntity } from 'src/users/users.entity';
import { CourseEntity } from 'src/course/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCourseEntity } from './user-course.entity';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(UserCourseEntity)
    private repo: Repository<UserCourseEntity>,
  ) {}

  find(skip: number, take: number) {
    if (skip && +skip > 0 && take && +take > 0) {
      return this.repo.find({
        skip: take * (skip - 1),
        take: take,
        relations: {
          user: true,
          course: true,
        },
      });
    } else {
      return this.repo.find({
        relations: {
          user: true,
          course: true,
        },
      });
    }
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      relations: {
        user: true,
        course: true,
      },
      where: { id },
    });
  }

  create(data: CreateUserCourseDto,) {
    const userCourse = this.repo.create(data);
    userCourse.user = data.user;
    userCourse.course = data.course;
    return this.repo.save(userCourse);
  }

  async update(id: number, attrs: Partial<UserCourseEntity>) {
    const course = await this.repo.findOneBy({ id });

    if (!course) {
      throw new NotFoundException('user-course not found');
    }

    Object.assign(course, attrs);
    return this.repo.save(course);
  }

  async delete(id: number) {
    const userCourse = await this.repo.findOneBy({ id });

    if (!userCourse) {
      throw new NotFoundException('user-course not found');
    }

    return this.repo.remove(userCourse);
  }
}
