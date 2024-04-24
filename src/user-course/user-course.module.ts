import { Module } from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { UserCourseController } from './user-course.controller';

@Module({
  providers: [UserCourseService],
  controllers: [UserCourseController]
})
export class UserCourseModule {}
