import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { ApiQuery } from '@nestjs/swagger';
import { QueryDto } from './dtos/query';
import { CreateUserCourseDto } from './dtos/user-course';

@Controller('')
export class UserCourseController {
  constructor(private userCourse: UserCourseService) {}

  @Get('user-courses')
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  findAll(@Query() query: QueryDto) {
    return this.userCourse.find(parseInt(query?.skip), parseInt(query?.take));
  }

  @Get('user-course/:id')
  async getOne(@Param('id') id: string) {
    const course = await this.userCourse.findOne(parseInt(id));
    if (!course) {
      throw new NotFoundException('user-course not found');
    }
    return course;
  }

  @Post('user-course')
  create(@Body() body: CreateUserCourseDto) {
    return this.userCourse.create(body);
  }

  @Patch('user-course/:id')
  updateCourse(@Param('id') id: string, @Body() body: CreateUserCourseDto) {
    return this.userCourse.update(parseInt(id), body);
  }

  @Delete('user-course/:id')
  removeCourse(@Param('id') id: string) {
    return this.userCourse.delete(parseInt(id));
  }
}
