import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
