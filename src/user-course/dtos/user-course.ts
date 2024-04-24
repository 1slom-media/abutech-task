import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Allow } from 'class-validator';
import { CourseEntity } from 'src/course/course.entity';
import { UsersEntity } from 'src/users/users.entity';

export class UserCourseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.course.id)
  courseId: number;
}

export class CreateUserCourseDto {
    @ApiProperty()
    @Allow()
    user: UsersEntity;
  
    @ApiProperty()
    @Allow()
    course:CourseEntity;
  }
