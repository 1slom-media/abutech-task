import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';
import { Repository } from 'typeorm';
import { CourseDto } from './dtos/course';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private repo: Repository<CourseEntity>,
  ) {}

  find(skip: number, take: number) {
    if (skip && +skip > 0 && take && +take > 0) {
      return this.repo.find({
        skip: take * (skip - 1),
        take: take,
      });
    } else {
      return this.repo.find();
    }
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  create(data: CourseDto) {
    const course = this.repo.create(data);
    return this.repo.save(course);
  }

  async update(id: number, attrs: Partial<CourseEntity>) {
    const course = await this.repo.findOneBy({ id });

    if (!course) {
      throw new NotFoundException('course not found');
    }

    Object.assign(course, attrs);
    return this.repo.save(course);
  }

  async delete(id: number) {
    const course = await this.repo.findOneBy({ id });

    if (!course) {
      throw new NotFoundException('course not found');
    }

    return this.repo.remove(course);
  }
}
